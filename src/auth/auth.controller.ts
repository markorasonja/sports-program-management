import { Controller, Post, Body, HttpCode, HttpException, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { UsersService } from '../users/users.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
	constructor(
		private authService: AuthService,
		private usersService: UsersService,
	) { }

	@Post('register')
	@ApiOperation({ summary: 'Register a new user', description: 'Creates a new user account with STUDENT role by default' })
	@ApiBody({ type: CreateUserDto })
	@ApiResponse({ status: 201, description: 'User registered successfully' })
	@ApiResponse({ status: 400, description: 'Bad request - invalid data or email already exists' })
	async register(@Body() createUserDto: CreateUserDto) {
		try {
			const user = await this.usersService.create(createUserDto);
			const { password, ...result } = user.toJSON();
			return result;
		} catch (error) {
			throw new HttpException(
				error.message,
				HttpStatus.BAD_REQUEST,
			);
		}
	}

	@Post('login')
	@HttpCode(200)
	@ApiOperation({ summary: 'User login', description: 'Authenticate a user and retrieve a JWT token' })
	@ApiBody({ type: LoginDto })
	@ApiResponse({
		status: 200,
		description: 'Login successful',
		schema: {
			properties: {
				access_token: { type: 'string', example: 'eyJhbGciOiJIUzI1N' },
				user: {
					type: 'object',
					properties: {
						id: { type: 'string', example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11' },
						firstName: { type: 'string', example: 'Marko' },
						lastName: { type: 'string', example: 'Rasonja' },
						email: { type: 'string', example: 'marko.rasonja@example.com' },
						role: { type: 'string', example: 'student' }
					}
				}
			}
		}
	})
	@ApiResponse({ status: 401, description: 'Unauthorized - invalid credentials' })
	async login(@Body() loginDto: LoginDto) {
		try {
			return this.authService.login(loginDto);
		} catch (error) {
			throw new HttpException(
				error.message,
				HttpStatus.UNAUTHORIZED,
			);
		}
	}
}