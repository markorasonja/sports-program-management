import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import { Class } from './entities/class.entity';
import { Schedule } from './entities/schedule.entity';
import { Sport } from '../sports/entities/sport.entity';
import { User } from '../users/entities/user.entity';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { Role } from '../common/enums/role.enum';

/**
 * Service handling class-related operations
 * 
 * This service manages the creation, modification, and retrieval of classes,
 * and their associated schedules.
 */
@Injectable()
export class ClassesService {
	constructor(
		@Inject('CLASS_REPOSITORY')
		private classRepository: typeof Class,
		@Inject('SCHEDULE_REPOSITORY')
		private scheduleRepository: typeof Schedule,
		@Inject('USER_REPOSITORY')
		private userRepository: typeof User,
		@Inject('SPORT_REPOSITORY')
		private sportRepository: typeof Sport,
	) { }

	/**
	 * Creates a new class
	 * 
	 * @param createClassDto - DTO class data
	 * @returns The newly created class
	 * @throws BadRequestException if sport not found or trainer invalid
	 */
	async create(createClassDto: CreateClassDto): Promise<Class> {
		const sport = await this.sportRepository.findByPk(createClassDto.sportId);
		if (!sport) {
			throw new BadRequestException('Sport not found');
		}

		if (createClassDto.trainerId) {
			const trainer = await this.userRepository.findByPk(createClassDto.trainerId);
			if (!trainer) {
				throw new BadRequestException('Trainer not found');
			}
			if (trainer.role !== Role.TRAINER) {
				throw new BadRequestException('User is not a trainer');
			}
		}

		return this.classRepository.create({
			...createClassDto
		});
	}

	/**
	 * Retrieves all classes
	 * 
	 * @returns Array of all classes
	 */
	async findAll(): Promise<Class[]> {
		return this.classRepository.findAll();
	}

	/**
	 * Finds a class by its ID
	 * 
	 * @param id - The class's ID
	 * @returns The found class with related data
	 * @throws NotFoundException if the class is not found
	 */
	async findOne(id: string): Promise<Class> {
		const classEntity = await this.classRepository.findByPk(id, {
			include: [Schedule, Sport]
		});

		if (!classEntity) {
			throw new NotFoundException('Class not found');
		}

		return classEntity;
	}

	/**
	 * Updates a class
	 * 
	 * @param id - The class Id
	 * @param updateClassDto - DTO data
	 * @returns The updated class
	 * @throws NotFoundException if the class is not found
	 * @throws BadRequestException if sport not found or trainer invalid
	 */
	async update(id: string, updateClassDto: UpdateClassDto): Promise<Class> {
		const classEntity = await this.findOne(id);

		if (updateClassDto.sportId) {
			const sport = await this.sportRepository.findByPk(updateClassDto.sportId);
			if (!sport) {
				throw new BadRequestException('Sport not found');
			}
		}

		if (updateClassDto.trainerId) {
			const trainer = await this.userRepository.findByPk(updateClassDto.trainerId);
			if (!trainer) {
				throw new BadRequestException('Trainer not found');
			}
			if (trainer.role !== Role.TRAINER) {
				throw new BadRequestException('User is not a trainer');
			}
		}

		await this.classRepository.update(updateClassDto, {
			where: { id }
		});

		return this.findOne(id);
	}

	/**
	 * Deletes a class
	 * 
	 * @param id - The class Id
	 * @throws NotFoundException if the class is not found
	 */
	async remove(id: string): Promise<void> {
		const classEntity = await this.findOne(id);

		if (!classEntity) {
			throw new NotFoundException('Class not found');
		}

		await classEntity.destroy();
	}

	/**
	 * Finds classes without an assigned trainer
	 * 
	 * @returns Array of classes that have no trainer assigned
	 */
	async findClassesWithoutTrainer(): Promise<Class[]> {
		return this.classRepository.findAll({
			where: {
				trainerId: null
			},
		});
	}

	/**
	 * Creates a new schedule for a class
	 * 
	 * @param createScheduleDto - Data for the new schedule
	 * @returns The newly created schedule
	 * @throws BadRequestException if class not found or time format invalid
	 */
	async addSchedule(createScheduleDto: CreateScheduleDto): Promise<Schedule> {
		const classEntity = await this.classRepository.findByPk(createScheduleDto.classId);
		if (!classEntity) {
			throw new BadRequestException('Class not found');
		}

		const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/;
		if (!timeRegex.test(createScheduleDto.startTime) || !timeRegex.test(createScheduleDto.endTime)) {
			throw new BadRequestException('Invalid time format. Use HH:MM or HH:MM:SS format');
		}

		if (createScheduleDto.startTime >= createScheduleDto.endTime) {
			throw new BadRequestException('Start time must be before end time');
		}

		return this.scheduleRepository.create({ ...createScheduleDto });
	}

	/**
	 * Retrieves all schedules
	 * 
	 * @returns Array of all schedules with related class data
	 */
	async findAllSchedules(): Promise<Schedule[]> {
		return this.scheduleRepository.findAll({
			include: [Class]
		});
	}

	/**
	 * Finds a schedule by ID
	 * 
	 * @param id - The schedule's Id
	 * @returns The found schedule with related class data
	 * @throws NotFoundException if the schedule is not found
	 */
	async findSchedule(id: string): Promise<Schedule> {
		const schedule = await this.scheduleRepository.findByPk(id, {
			include: [Class]
		});

		if (!schedule) {
			throw new NotFoundException('Schedule not found');
		}

		return schedule;
	}

	/**
	 * Updates a schedule's information
	 * 
	 * @param id - The schedule's unique identifier
	 * @param updateScheduleDto - Data to update
	 * @returns Updated schedule
	 * @throws NotFoundException if the schedule is not found
	 * @throws BadRequestException if time format is invalid
	 */
	async updateSchedule(id: string, updateScheduleDto: UpdateScheduleDto): Promise<Schedule> {
		const schedule = await this.findSchedule(id);
		if (!schedule) {
			throw new NotFoundException('Schedule not found');
		}

		const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/;
		if (updateScheduleDto.startTime && !timeRegex.test(updateScheduleDto.startTime)) {
			throw new BadRequestException('Invalid start time format. Use HH:MM or HH:MM:SS format');
		}
		if (updateScheduleDto.endTime && !timeRegex.test(updateScheduleDto.endTime)) {
			throw new BadRequestException('Invalid end time format. Use HH:MM or HH:MM:SS format');
		}

		await this.scheduleRepository.update(updateScheduleDto, {
			where: { id }
		});

		return this.findSchedule(id);
	}

	/**
	 * Removes a schedule
	 * 
	 * @param id - The schedule's Id
	 * @throws NotFoundException if the schedule is not found
	 */
	async removeSchedule(id: string): Promise<void> {
		const schedule = await this.findSchedule(id);
		if (!schedule) {
			throw new NotFoundException('Schedule not found');
		}
		await schedule.destroy();
	}

	/**
	 * Finds all schedules for a specific class
	 * 
	 * @param classId - The class ID
	 * @returns Array of schedules for the specified class
	 * @throws NotFoundException if the class is not found
	 */
	async findSchedulesByClass(classId: string): Promise<Schedule[]> {
		await this.findOne(classId);

		return this.scheduleRepository.findAll({
			where: { classId },
		});
	}

	/**
	 * Checks if a trainer is assigned to class
	 * 
	 * @param trainerId - The trainer's Id
	 * @param classId - The class's Id
	 * @returns True if the trainer is assigned, false otherwise
	 * @throws NotFoundException if the class is not found
	 */
	async isTrainerAssignedToClass(trainerId: string, classId: string): Promise<boolean> {
		const classEntity = await this.classRepository.findByPk(classId);
		if (!classEntity) {
			throw new NotFoundException('Class not found');
		}

		return classEntity.trainerId === trainerId;
	}
}