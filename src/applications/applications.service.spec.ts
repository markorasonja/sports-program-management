import { Test, TestingModule } from '@nestjs/testing';
import { ApplicationsService } from './applications.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { ApplicationStatus } from '../common/enums/application-status.enum';
import { ApplicationType } from '../common/enums/application-type.enum';
import { Role } from '../common/enums/role.enum';

describe('ApplicationsService', () => {
	let service: ApplicationsService;
	let mockApplicationRepository;
	let mockClassRepository;
	let mockUserRepository;

	const mockStudent = {
		id: 'student-id',
		firstName: 'Student',
		lastName: 'Test',
		email: 'student@example.com',
		role: Role.STUDENT
	};

	const mockTrainer = {
		id: 'trainer-id',
		firstName: 'Trainer',
		lastName: 'Test',
		email: 'trainer@example.com',
		role: Role.TRAINER
	};

	const mockAdmin = {
		id: 'admin-id',
		firstName: 'Admin',
		lastName: 'Test',
		email: 'admin@example.com',
		role: Role.ADMIN
	};

	const mockClass = {
		id: 'class-id',
		name: 'Test Class',
		description: 'A test class',
		maxCapacity: 20,
		trainerId: null
	};

	const mockApplication = {
		id: 'application-id',
		userId: 'student-id',
		classId: 'class-id',
		status: ApplicationStatus.PENDING,
		type: ApplicationType.STUDENT_ENROLLMENT,
		destroy: jest.fn().mockResolvedValue(true)
	};

	beforeEach(async () => {
		mockApplicationRepository = {
			create: jest.fn(),
			findAll: jest.fn(),
			findOne: jest.fn(),
			findByPk: jest.fn(),
			update: jest.fn(),
			count: jest.fn(),
			destroy: jest.fn()
		};

		mockClassRepository = {
			findByPk: jest.fn(),
			update: jest.fn()
		};

		mockUserRepository = {
			findByPk: jest.fn()
		};

		const module: TestingModule = await Test.createTestingModule({
			providers: [
				ApplicationsService,
				{
					provide: 'APPLICATION_REPOSITORY',
					useValue: mockApplicationRepository
				},
				{
					provide: 'CLASS_REPOSITORY',
					useValue: mockClassRepository
				},
				{
					provide: 'USER_REPOSITORY',
					useValue: mockUserRepository
				}
			],
		}).compile();

		service = module.get<ApplicationsService>(ApplicationsService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	describe('create', () => {
		it('should create a student enrollment application', async () => {
			mockClassRepository.findByPk.mockResolvedValue(mockClass);
			mockUserRepository.findByPk.mockResolvedValue(mockStudent);
			mockApplicationRepository.findOne.mockResolvedValue(null);
			mockApplicationRepository.create.mockResolvedValue({
				id: 'new-application-id',
				userId: mockStudent.id,
				classId: mockClass.id,
				status: ApplicationStatus.PENDING,
				type: ApplicationType.STUDENT_ENROLLMENT
			});

			const result = await service.create(mockStudent.id, { classId: mockClass.id });

			expect(mockClassRepository.findByPk).toHaveBeenCalledWith(mockClass.id);
			expect(mockUserRepository.findByPk).toHaveBeenCalledWith(mockStudent.id);
			expect(mockApplicationRepository.findOne).toHaveBeenCalledWith({
				where: {
					userId: mockStudent.id,
					classId: mockClass.id,
					type: ApplicationType.STUDENT_ENROLLMENT
				}
			});
			expect(mockApplicationRepository.create).toHaveBeenCalledWith({
				userId: mockStudent.id,
				classId: mockClass.id,
				status: ApplicationStatus.PENDING,
				type: ApplicationType.STUDENT_ENROLLMENT
			});
			expect(result).toEqual({
				id: 'new-application-id',
				userId: mockStudent.id,
				classId: mockClass.id,
				status: ApplicationStatus.PENDING,
				type: ApplicationType.STUDENT_ENROLLMENT
			});
		});

		it('should create a trainer assignment application', async () => {
			mockClassRepository.findByPk.mockResolvedValue(mockClass);
			mockUserRepository.findByPk.mockResolvedValue(mockTrainer);
			mockApplicationRepository.findOne.mockResolvedValue(null);
			mockApplicationRepository.create.mockResolvedValue({
				id: 'trainer-application-id',
				userId: mockTrainer.id,
				classId: mockClass.id,
				status: ApplicationStatus.PENDING,
				type: ApplicationType.TRAINER_ASSIGNMENT
			});

			const result = await service.create(mockTrainer.id, {
				classId: mockClass.id,
				type: ApplicationType.TRAINER_ASSIGNMENT
			});

			expect(result.type).toBe(ApplicationType.TRAINER_ASSIGNMENT);
		});

		it('should throw BadRequestException if student already applied', async () => {
			mockClassRepository.findByPk.mockResolvedValue(mockClass);
			mockUserRepository.findByPk.mockResolvedValue(mockStudent);
			mockApplicationRepository.findOne.mockResolvedValue(mockApplication);

			await expect(
				service.create(mockStudent.id, { classId: mockClass.id })
			).rejects.toThrow(BadRequestException);
		});

		it('should throw BadRequestException if class already has a trainer', async () => {

			const classWithTrainer = { ...mockClass, trainerId: 'existing-trainer-id' };
			mockClassRepository.findByPk.mockResolvedValue(classWithTrainer);
			mockUserRepository.findByPk.mockResolvedValue(mockTrainer);

			await expect(
				service.create(mockTrainer.id, {
					classId: mockClass.id,
					type: ApplicationType.TRAINER_ASSIGNMENT
				})
			).rejects.toThrow(BadRequestException);
		});
	});

	describe('updateStatus', () => {
		it('should approve a student application', async () => {
			mockApplicationRepository.findByPk.mockResolvedValue({
				...mockApplication,
				include: true
			});
			mockClassRepository.findByPk.mockResolvedValue(mockClass);
			mockApplicationRepository.count.mockResolvedValue(10); // Less than max capacity

			await service.updateStatus(
				mockApplication.id,
				{ status: ApplicationStatus.APPROVED }
			);

			expect(mockApplicationRepository.update).toHaveBeenCalledWith(
				{ status: ApplicationStatus.APPROVED },
				{ where: { id: mockApplication.id } }
			);
		});

		it('should throw BadRequestException when student class is at capacity', async () => {
			mockApplicationRepository.findByPk.mockResolvedValue({
				...mockApplication,
				include: true
			});
			mockClassRepository.findByPk.mockResolvedValue(mockClass);
			mockApplicationRepository.count.mockResolvedValue(20);

			await expect(
				service.updateStatus(
					mockApplication.id,
					{ status: ApplicationStatus.APPROVED }
				)
			).rejects.toThrow(BadRequestException);
		});

		it('should approve trainer application and update class', async () => {
			const trainerApplication = {
				...mockApplication,
				include: true,
				type: ApplicationType.TRAINER_ASSIGNMENT,
				userId: mockTrainer.id
			};

			mockApplicationRepository.findByPk.mockResolvedValue(trainerApplication);
			mockClassRepository.findByPk.mockResolvedValue(mockClass);

			await service.updateStatus(
				trainerApplication.id,
				{ status: ApplicationStatus.APPROVED }
			);

			expect(mockClassRepository.update).toHaveBeenCalledWith(
				{ trainerId: mockTrainer.id },
				{ where: { id: mockClass.id } }
			);
			expect(mockApplicationRepository.update).toHaveBeenCalledWith(
				{ status: ApplicationStatus.REJECTED },
				expect.any(Object)
			);
		});
	});

	describe('remove', () => {
		it('should allow admin to delete any application', async () => {
			const approvedApplication = {
				...mockApplication,
				status: ApplicationStatus.APPROVED
			};
			mockApplicationRepository.findByPk.mockResolvedValue(approvedApplication);

			await service.remove(approvedApplication.id);
			expect(mockApplication.destroy).toHaveBeenCalled();
		});

		it('should throw error if application not found', async () => {
			mockApplicationRepository.findByPk.mockResolvedValue(null);

			await expect(
				service.remove('non-existent-id')
			).rejects.toThrow(NotFoundException);
		});
	});
});