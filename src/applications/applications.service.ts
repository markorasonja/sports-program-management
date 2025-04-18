import { Injectable, Inject, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { Application } from './entities/application.entity';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationStatusDto } from './dto/update-application-status.dto';
import { Class } from '../classes/entities/class.entity';
import { User } from '../users/entities/user.entity';
import { Role } from '../common/enums/role.enum';
import { ApplicationStatus } from '../common/enums/application-status.enum';
import { ApplicationType } from '../common/enums/application-type.enum';
import { Op } from 'sequelize';

/**
 * Service handling application-related operations
 * 
 * This service manages student enrollments and trainer assignments to classes.
 * It provides methods to create applications, update their status, and manage
 * the relationship between users, trainers, and classes.
 */
@Injectable()
export class ApplicationsService {
	constructor(
		@Inject('APPLICATION_REPOSITORY')
		private applicationRepository: typeof Application,
		@Inject('CLASS_REPOSITORY')
		private classRepository: typeof Class,
		@Inject('USER_REPOSITORY')
		private userRepository: typeof User
	) { }

	/**
	 * Creates a new application
	 * 
	 * @param userId - The ID of the user creating the application
	 * @param createApplicationDto - Data for the application
	 * @returns The created application
	 * @throws NotFoundException if the class or user is not found
	 * @throws BadRequestException if the user already applied or has wrong role
	 */
	async create(userId: string, createApplicationDto: CreateApplicationDto): Promise<Application> {
		const classEntity = await this.classRepository.findByPk(createApplicationDto.classId);
		if (!classEntity) {
			throw new NotFoundException('Class not found');
		}

		const user = await this.userRepository.findByPk(userId);
		if (!user) {
			throw new NotFoundException('User not found');
		}

		let applicationType = ApplicationType.STUDENT_ENROLLMENT;

		if (user.role === Role.TRAINER) {
			applicationType = ApplicationType.TRAINER_ASSIGNMENT;

			if (classEntity.trainerId) {
				throw new BadRequestException('This class already has an assigned trainer');
			}
		}

		const existingApplication = await this.applicationRepository.findOne({
			where: {
				userId,
				classId: createApplicationDto.classId,
				type: applicationType
			}
		});

		if (existingApplication) {
			throw new BadRequestException('You have already applied for this class');
		}

		return this.applicationRepository.create({
			userId,
			classId: createApplicationDto.classId,
			status: ApplicationStatus.PENDING,
			type: applicationType
		});
	}

	/**
	 * Retrieves all applications
	 * 
	 * @returns Array of all applications with related user and class data
	 */
	async findAll(): Promise<Application[]> {
		return this.applicationRepository.findAll({
			include: [
				{ model: User, attributes: { exclude: ['password'] } },
				Class
			]
		});
	}

	/**
	 * Finds all applications for a specific class
	 * 
	 * @param classId - The class's unique identifier
	 * @returns Array of applications for the specified class
	 * @throws NotFoundException if the class is not found
	 */
	async findAllByClass(classId: string): Promise<Application[]> {
		const classEntity = await this.classRepository.findByPk(classId);
		if (!classEntity) {
			throw new NotFoundException('Class not found');
		}

		return this.applicationRepository.findAll({
			where: { classId },
			include: [
				Class
			]
		});
	}

	/**
	 * Finds all applications from a specific user
	 * 
	 * @param userId - The user's unique identifier
	 * @returns Array of applications from the specified user
	 * @throws NotFoundException if the user is not found
	 */
	async findAllByUser(userId: string): Promise<Application[]> {
		const user = await this.userRepository.findByPk(userId);
		if (!user) {
			throw new NotFoundException('User not found');
		}

		return this.applicationRepository.findAll({
			where: { userId },
			include: [
				{ model: User, attributes: { exclude: ['password'] } },
				Class
			]
		});
	}

	/**
	 * Finds a specific application
	 * 
	 * @param id - The application's unique identifier
	 * @returns The found application with related user and class data
	 * @throws NotFoundException if the application is not found
	 */
	async findOne(id: string): Promise<Application> {
		const application = await this.applicationRepository.findByPk(id, {
			include: [
				{ model: User, attributes: { exclude: ['password'] } },
				Class
			]
		});

		if (!application) {
			throw new NotFoundException('Application not found');
		}

		return application;
	}

	/**
	 * Updates an application's status
	 * 
	 * @param id - The application's unique identifier
	 * @param updateStatusDto - New status data
	 * @returns The updated application
	 * @throws NotFoundException if the application is not found
	 * @throws BadRequestException if class is at capacity or already has trainer
	 */
	async updateStatus(
		id: string,
		updateStatusDto: UpdateApplicationStatusDto,
	): Promise<Application> {
		const application = await this.findOne(id);

		const classEntity = await this.classRepository.findByPk(application.classId);
		if (!classEntity) {
			throw new NotFoundException('Class not found');
		}

		if (application.type === ApplicationType.TRAINER_ASSIGNMENT) {
			if (updateStatusDto.status === ApplicationStatus.APPROVED) {
				if (classEntity.trainerId) {
					throw new BadRequestException('This class already has an assigned trainer');
				}

				await this.classRepository.update(
					{ trainerId: application.userId },
					{ where: { id: application.classId } }
				);

				await this.applicationRepository.update(
					{ status: ApplicationStatus.REJECTED },
					{
						where: {
							classId: application.classId,
							type: ApplicationType.TRAINER_ASSIGNMENT,
							status: ApplicationStatus.PENDING,
							id: { [Op.ne]: id }
						}
					}
				);
			}
		} else if (application.type === ApplicationType.STUDENT_ENROLLMENT) {
			if (updateStatusDto.status === ApplicationStatus.APPROVED) {
				const approvedApplicationsCount = await this.applicationRepository.count({
					where: {
						classId: application.classId,
						status: ApplicationStatus.APPROVED,
						type: ApplicationType.STUDENT_ENROLLMENT
					}
				});

				if (approvedApplicationsCount >= classEntity.maxCapacity) {
					throw new BadRequestException('Class is already at maximum capacity');
				}
			}
		}

		await this.applicationRepository.update(
			{ status: updateStatusDto.status },
			{ where: { id } }
		);

		return this.findOne(id);
	}

	/**
	 * Removes an application
	 * 
	 * @param id - The application's unique identifier
	 * @throws NotFoundException if the application is not found
	 */
	async remove(id: string): Promise<void> {
		const application = await this.findOne(id);
		await application.destroy();
	}
}