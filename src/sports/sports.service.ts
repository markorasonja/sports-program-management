import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Sport } from './entities/sport.entity';
import { CreateSportDto } from './dto/create-sport.dto';
import { UpdateSportDto } from './dto/update-sport.dto';

/**
 * Service handling sports-related operations
 * 
 * This service provides methods to create, read, update and delete sports in the system.
 * It includes validation for unique sport names and proper error handling.
 */
@Injectable()
export class SportsService {
	constructor(
		@Inject('SPORT_REPOSITORY')
		private sportRepository: typeof Sport,
	) { }

	/**
	 * Creates a new sport
	 * 
	 * @param createSportDto - Data for the new sport
	 * @returns The newly created sport
	 * @throws Error if a sport with the same name already exists
	 */
	async create(createSportDto: CreateSportDto): Promise<Sport> {
		const existingSport = await this.sportRepository.findOne({
			where: { name: createSportDto.name },
		});

		if (existingSport) {
			throw new Error("Sport with this name already exists");
		}

		return this.sportRepository.create({ ...createSportDto });
	}

	/**
	 * Retrieves all sports
	 * 
	 * @returns Array of all sports
	 */
	async findAll(): Promise<Sport[]> {
		return this.sportRepository.findAll();
	}

	/**
	 * Finds a sport by its ID
	 * 
	 * @param id - The sport's unique identifier
	 * @returns The found sport
	 * @throws NotFoundException if the sport is not found
	 */
	async findOne(id: string): Promise<Sport> {
		const sport = await this.sportRepository.findByPk(id);

		if (!sport) {
			throw new NotFoundException("Sport not found");
		}

		return sport;
	}

	/**
	 * Updates a sport's information
	 * 
	 * @param id - The sport's unique identifier
	 * @param updateSportDto - Data to update
	 * @returns The updated sport
	 * @throws NotFoundException if the sport is not found
	 * @throws Error if trying to update to a name that already exists
	 */
	async update(id: string, updateSportDto: UpdateSportDto): Promise<Sport> {
		const sport = await this.findOne(id);

		if (updateSportDto.name && updateSportDto.name !== sport.name) {
			const existingSport = await this.sportRepository.findOne({
				where: { name: updateSportDto.name },
			});

			if (existingSport) {
				throw new Error("Sport with this name already exists");
			}
		}

		await this.sportRepository.update(updateSportDto, {
			where: { id },
		});

		return this.findOne(id);
	}

	/**
	 * Permanently removes a sport
	 * 
	 * @param id - The sport's unique identifier
	 * @throws NotFoundException if the sport is not found
	 */
	async remove(id: string): Promise<void> {
		const sport = await this.findOne(id);

		await this.sportRepository.destroy({
			where: { id },
		});

		return;
	}
}