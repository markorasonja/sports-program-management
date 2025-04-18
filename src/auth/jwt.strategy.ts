import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(
		private usersService: UsersService,
		private configService: ConfigService,
	) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: configService.get<string>('JWT_SECRET') || 'secret',
		});
	}

	async validate(payload: any) {
		const user = await this.usersService.findOneByEmail(payload.email);

		if (!user) {
			throw new UnauthorizedException();
		}

		return { id: payload.sub, email: payload.email, role: payload.role };
	}
}