import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { UnauthorizedException } from '@nestjs/common';
import { Role } from '../common/enums/role.enum';

describe('AuthService', () => {
	let authService: AuthService;
	let usersService: UsersService;
	let jwtService: JwtService;

	const mockUser = {
		id: 'user-id',
		email: 'test@example.com',
		firstName: 'Test',
		lastName: 'User',
		password: 'hashedpassword',
		role: Role.STUDENT,
		toJSON: () => ({
			id: 'user-id',
			email: 'test@example.com',
			firstName: 'Test',
			lastName: 'User',
			role: Role.STUDENT
		})
	};

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				AuthService,
				{
					provide: UsersService,
					useValue: {
						findOneByEmail: jest.fn(),
						comparePassword: jest.fn()
					}
				},
				{
					provide: JwtService,
					useValue: {
						sign: jest.fn().mockReturnValue('mock_token')
					}
				}
			],
		}).compile();

		authService = module.get<AuthService>(AuthService);
		usersService = module.get<UsersService>(UsersService);
		jwtService = module.get<JwtService>(JwtService);
	});

	it('should be defined', () => {
		expect(authService).toBeDefined();
	});

	describe('validateUser', () => {
		it('should validate a user with correct credentials', async () => {
			jest.spyOn(usersService, 'findOneByEmail').mockResolvedValue(mockUser as any);
			jest.spyOn(usersService, 'comparePassword').mockResolvedValue(true);

			const result = await authService.validateUser('test@example.com', 'password123');

			expect(usersService.findOneByEmail).toHaveBeenCalledWith('test@example.com');
			expect(usersService.comparePassword).toHaveBeenCalledWith('password123', 'hashedpassword');
			expect(result).toEqual({
				id: 'user-id',
				email: 'test@example.com',
				firstName: 'Test',
				lastName: 'User',
				role: Role.STUDENT
			});
		});

		it('should return null for invalid credentials', async () => {
			jest.spyOn(usersService, 'findOneByEmail').mockResolvedValue(mockUser as any);
			jest.spyOn(usersService, 'comparePassword').mockResolvedValue(false);

			const result = await authService.validateUser('test@example.com', 'wrongpassword');

			expect(result).toBeNull();
		});

		it('should return null if user not found', async () => {
			jest.spyOn(usersService, 'findOneByEmail').mockImplementation(() => {
				throw new Error('User not found');
			});

			const result = await authService.validateUser('nonexistent@example.com', 'password123');

			expect(result).toBeNull();
		});
	});

	describe('login', () => {
		it('should generate a JWT token for valid credentials', async () => {
			jest.spyOn(authService, 'validateUser').mockResolvedValue({
				id: 'user-id',
				email: 'test@example.com',
				firstName: 'Test',
				lastName: 'User',
				role: Role.STUDENT
			});

			const result = await authService.login({ email: 'test@example.com', password: 'password123' });

			expect(jwtService.sign).toHaveBeenCalledWith({
				email: 'test@example.com',
				sub: 'user-id',
				role: Role.STUDENT
			});

			expect(result).toEqual({
				access_token: 'mock_token',
				user: {
					id: 'user-id',
					email: 'test@example.com',
					firstName: 'Test',
					lastName: 'User',
					role: Role.STUDENT
				}
			});
		});

		it('should throw UnauthorizedException for invalid credentials', async () => {
			jest.spyOn(authService, 'validateUser').mockResolvedValue(null);

			await expect(
				authService.login({ email: 'test@example.com', password: 'wrongpassword' })
			).rejects.toThrow(UnauthorizedException);
		});
	});
});