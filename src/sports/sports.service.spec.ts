import { Test, TestingModule } from '@nestjs/testing';
import { SportsService } from './sports.service';
import { NotFoundException } from '@nestjs/common';
import { CreateSportDto } from './dto/create-sport.dto';
import { UpdateSportDto } from './dto/update-sport.dto';

describe('SportsService', () => {
	let service: SportsService;
	let mockSportRepository;

	const mockSport = {
		id: '10eebc99-9c0b-4ef8-bb6d-6bb9bd380a19',
		name: 'Yoga',
		description: 'Ancient practice combining physical postures, breathing techniques, and meditation',
		toJSON: () => mockSport
	};

	beforeEach(async () => {
		mockSportRepository = {
			findAll: jest.fn().mockResolvedValue([mockSport]),
			findByPk: jest.fn(),
			findOne: jest.fn(),
			create: jest.fn(),
			update: jest.fn(),
			destroy: jest.fn()
		};

		const module: TestingModule = await Test.createTestingModule({
			providers: [
				SportsService,
				{
					provide: 'SPORT_REPOSITORY',
					useValue: mockSportRepository
				}
			],
		}).compile();

		service = module.get<SportsService>(SportsService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	describe('findAll', () => {
		it('should return an array of sports', async () => {
			const result = await service.findAll();
			expect(result).toEqual([mockSport]);
			expect(mockSportRepository.findAll).toHaveBeenCalled();
		});
	});

	describe('findOne', () => {
		it('should return a single sport', async () => {
			mockSportRepository.findByPk.mockResolvedValue(mockSport);

			const result = await service.findOne('10eebc99-9c0b-4ef8-bb6d-6bb9bd380a19');

			expect(result).toEqual(mockSport);
			expect(mockSportRepository.findByPk).toHaveBeenCalledWith('10eebc99-9c0b-4ef8-bb6d-6bb9bd380a19');
		});

		it('should throw NotFoundException when sport is not found', async () => {
			mockSportRepository.findByPk.mockResolvedValue(null);

			await expect(service.findOne('non-existent-id')).rejects.toThrow(NotFoundException);
		});
	});

	describe('create', () => {
		it('should create a new sport', async () => {
			const createSportDto: CreateSportDto = {
				name: 'Basketball',
				description: 'Team sport played with a ball and hoop'
			};

			mockSportRepository.findOne.mockResolvedValue(null);
			mockSportRepository.create.mockResolvedValue({
				id: 'new-id',
				...createSportDto
			});

			const result = await service.create(createSportDto);

			expect(result).toEqual({
				id: 'new-id',
				name: 'Basketball',
				description: 'Team sport played with a ball and hoop'
			});
			expect(mockSportRepository.findOne).toHaveBeenCalledWith({
				where: { name: 'Basketball' }
			});
			expect(mockSportRepository.create).toHaveBeenCalledWith(createSportDto);
		});

		it('should throw an error if sport name already exists', async () => {
			const createSportDto: CreateSportDto = {
				name: 'Yoga',
				description: 'Some description'
			};

			mockSportRepository.findOne.mockResolvedValue(mockSport);

			await expect(service.create(createSportDto)).rejects.toThrow(
				'Sport with this name already exists'
			);
		});
	});

	describe('update', () => {
		it('should update a sport', async () => {
			const updateSportDto: UpdateSportDto = {
				description: 'Updated description'
			};

			mockSportRepository.findByPk.mockResolvedValue(mockSport);
			mockSportRepository.update.mockResolvedValue([1]);

			const result = await service.update(mockSport.id, updateSportDto);

			expect(mockSportRepository.update).toHaveBeenCalledWith(
				updateSportDto,
				{ where: { id: mockSport.id } }
			);
			expect(mockSportRepository.findByPk).toHaveBeenCalledTimes(2);  // First for check, second for return
		});

		it('should check for name uniqueness when updating name', async () => {
			const updateSportDto: UpdateSportDto = {
				name: 'Swimming'
			};

			mockSportRepository.findByPk.mockResolvedValue(mockSport);
			mockSportRepository.findOne.mockResolvedValue(null);
			mockSportRepository.update.mockResolvedValue([1]);

			await service.update(mockSport.id, updateSportDto);

			expect(mockSportRepository.findOne).toHaveBeenCalledWith({
				where: { name: 'Swimming' }
			});
		});

		it('should throw error when updating to an existing name', async () => {
			const updateSportDto: UpdateSportDto = {
				name: 'Swimming'
			};

			mockSportRepository.findByPk.mockResolvedValue(mockSport);
			mockSportRepository.findOne.mockResolvedValue({ id: 'another-id', name: 'Swimming' });

			await expect(service.update(mockSport.id, updateSportDto)).rejects.toThrow(
				'Sport with this name already exists'
			);
		});
	});

	describe('remove', () => {
		it('should delete a sport', async () => {
			mockSportRepository.findByPk.mockResolvedValue(mockSport);

			await service.remove(mockSport.id);

			expect(mockSportRepository.destroy).toHaveBeenCalledWith({
				where: { id: mockSport.id }
			});
		});

		it('should throw NotFoundException when trying to delete non-existent sport', async () => {
			mockSportRepository.findByPk.mockResolvedValue(null);

			await expect(service.remove('non-existent-id')).rejects.toThrow(NotFoundException);
			expect(mockSportRepository.destroy).not.toHaveBeenCalled();
		});
	});
});