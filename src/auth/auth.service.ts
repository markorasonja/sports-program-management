import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';

/**
 * Authentication service responsible for user validation and JWT token generation
 * 
 * Service handles authentication flows including user credentials validation
 * and generating secure JWT tokens for authenticated users.
 */
@Injectable()
export class AuthService {
	constructor(
		private usersService: UsersService,
		private jwtService: JwtService,
	) { }

	/**
	 * Validates a user's credentials against stored user data
	 * 
	 * @param email - The email address of the user
	 * @param password - The plain text password provided by the user
	 * @returns The user object without the password if valid, null otherwise
	 */
	async validateUser(email: string, password: string): Promise<any> {
		try {
			const user = await this.usersService.findOneByEmail(email);

			if (!user) {
				return null;
			}

			const isPasswordValid = await this.usersService.comparePassword(password, user.password);

			if (isPasswordValid) {
				const { password, ...result } = user.toJSON();
				return result;
			}

			return null;
		} catch (error) {
			return null;
		}
	}

	/**
	 * Authenticates a user and generates a JWT token
	 * 
	 * @param loginDto - DTO containing email and password
	 * @returns Object containing the JWT access token and user information
	 * @throws UnauthorizedException if credentials are invalid
	 */
	async login(loginDto: LoginDto) {
		const { email, password } = loginDto;
		const user = await this.validateUser(email, password);

		if (!user) {
			throw new UnauthorizedException('Invalid credentials');
		}

		const payload = { email: user.email, sub: user.id, role: user.role };

		return {
			access_token: this.jwtService.sign(payload),
			user,
		};
	}
}