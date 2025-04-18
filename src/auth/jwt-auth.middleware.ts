import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtAuthMiddleware implements NestMiddleware {
	constructor(
		private jwtService: JwtService,
		private configService: ConfigService,
	) { }

	use(req: Request, res: Response, next: NextFunction) {
		const authHeader = req.headers.authorization;

		if (!authHeader || !authHeader.startsWith('Bearer ')) {
			throw new UnauthorizedException('Invalid token');
		}

		const token = authHeader.split(' ')[1];
		const secret = this.configService.get<string>('JWT_SECRET');

		try {
			const decoded = this.jwtService.verify(token, { secret });
			req['user'] = decoded;
			next();
		} catch (error) {
			throw new UnauthorizedException('Invalid token');
		}
	}
}