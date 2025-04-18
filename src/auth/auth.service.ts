import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
	constructor(
		private usersService: UsersService,
		private jwtService: JwtService,
	) { }

	async validateUser(email: string, password: string): Promise<any> {
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
	}

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