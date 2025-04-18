import { Controller, Post, Body, HttpCode, HttpException, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { UsersService } from '../users/users.service';

@Controller('auth')
export class AuthController {
	constructor(
		private authService: AuthService,
		private usersService: UsersService,
	) { }

	@Post('register')
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