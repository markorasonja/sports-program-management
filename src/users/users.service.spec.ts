import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from '../common/enums/role.enum';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('UsersService', () => {
	let service: UsersService;
	let mockUserRepository;

	const mockUser = {
		id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
		firstName: 'Marko',
		lastName: 'Rasonja',
		email: 'marko.rasonja@example.com',
		password: 'hashedpassword',
		role: Role.STUDENT,
		dateOfBirth: new Date('1990-01-01'),
		about: 'test user',
		phoneNumber: '+1234567890',
		toJSON: () => mockUser
	};

	beforeEach(async () => {
		mockUserRepository = {
			create: jest.fn(),
			findAll: jest.fn().mockResolvedValue([mockUser]),
			findByPk: jest.fn(),
			findOne: jest.fn(),
			update: jest.fn(),
			destroy: jest.fn()
		};

		const module: TestingModule = await Test.createTestingModule({
			providers: [
				UsersService,
				{
					provide: 'USER_REPOSITORY',
					useValue: mockUserRepository
				}
			],
		}).compile();

		service = module.get<UsersService>(UsersService);
		(bcrypt.genSalt as jest.Mock).mockResolvedValue('salt');
		(bcrypt.hash as jest.Mock).mockResolvedValue('hashedpassword');
		(bcrypt.compare as jest.Mock).mockResolvedValue(true);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	describe('create', () => {
		it('should create a new user with hashed password', async () => {
			const createUserDto: CreateUserDto = {
				firstName: 'Jane',
				lastName: 'Smith',
				email: 'jane.smith@example.com',
				password: 'password123',
				dateOfBirth: new Date('1992-05-15'),
				about: 'New user',
				phoneNumber: '+0987654321'
			};

			mockUserRepository.findOne.mockResolvedValue(null);
			mockUserRepository.create.mockResolvedValue({
				id: 'new-user-id',
				...createUserDto,
				password: 'hashedpassword',
				role: Role.STUDENT
			});

			const result = await service.create(createUserDto);

			expect(bcrypt.genSalt).toHaveBeenCalledWith(10);
			expect(bcrypt.hash).toHaveBeenCalledWith('password123', 'salt');
			expect(mockUserRepository.create).toHaveBeenCalledWith({
				...createUserDto,
				password: 'hashedpassword'
			});
			expect(result.password).toBe('hashedpassword');
		});

		it('should throw error if email already exists', async () => {
			const createUserDto: CreateUserDto = {
				firstName: 'Jane',
				lastName: 'Smith',
				email: 'existing@example.com',
				password: 'password123'
			};

			mockUserRepository.findOne.mockResolvedValue(mockUser);

			await expect(service.create(createUserDto)).rejects.toThrow('Email already exists');
		});
	});

	describe('findAll', () => {
		it('should return an array of users', async () => {
			const result = await service.findAll();

			expect(result).toEqual([mockUser]);
			expect(mockUserRepository.findAll).toHaveBeenCalled();
		});
	});

	describe('findOne', () => {
		it('should find a user by id', async () => {
			mockUserRepository.findByPk.mockResolvedValue(mockUser);

			const result = await service.findOne(mockUser.id);

			expect(result).toEqual(mockUser);
			expect(mockUserRepository.findByPk).toHaveBeenCalledWith(mockUser.id);
		});

		it('should throw error if user not found', async () => {
			mockUserRepository.findByPk.mockResolvedValue(null);

			await expect(service.findOne('non-existent-id')).rejects.toThrow('User not found');
		});
	});

	describe('update', () => {
		it('should update user details', async () => {
			const updateUserDto: UpdateUserDto = {
				firstName: 'John Updated',
				about: 'Updated bio'
			};

			mockUserRepository.findByPk.mockResolvedValue(mockUser);
			mockUserRepository.update.mockResolvedValue([1]);

			await service.update(mockUser.id, updateUserDto);

			expect(mockUserRepository.update).toHaveBeenCalledWith(
				updateUserDto,
				{ where: { id: mockUser.id } }
			);
		});

		it('should hash password when updating password', async () => {
			const updateUserDto: UpdateUserDto = {
				password: 'newpassword123'
			};

			mockUserRepository.findByPk.mockResolvedValue(mockUser);

			await service.update(mockUser.id, updateUserDto);

			expect(bcrypt.hash).toHaveBeenCalledWith('newpassword123', 'salt');
			expect(mockUserRepository.update).toHaveBeenCalledWith(
				{ password: 'hashedpassword' },
				{ where: { id: mockUser.id } }
			);
		});

		it('should check email uniqueness when updating email', async () => {
			const updateUserDto: UpdateUserDto = {
				email: 'newemail@example.com'
			};

			mockUserRepository.findByPk.mockResolvedValue(mockUser);
			mockUserRepository.findOne.mockResolvedValue(null);

			await service.update(mockUser.id, updateUserDto);

			expect(mockUserRepository.findOne).toHaveBeenCalledWith({
				where: { email: 'newemail@example.com' }
			});
		});

		it('should throw error when updating to existing email', async () => {
			const updateUserDto: UpdateUserDto = {
				email: 'existing@example.com'
			};

			mockUserRepository.findByPk.mockResolvedValue(mockUser);
			mockUserRepository.findOne.mockResolvedValue({ id: 'another-id', email: 'existing@example.com' });

			await expect(service.update(mockUser.id, updateUserDto)).rejects.toThrow('Email already exists');
		});
	});

	describe('comparePassword', () => {
		it('should compare plain text password with hashed password', async () => {
			const result = await service.comparePassword('password123', 'hashedpassword');

			expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashedpassword');
			expect(result).toBe(true);
		});
	});
});