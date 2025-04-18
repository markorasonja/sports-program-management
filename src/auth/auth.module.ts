import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { JwtStrategy } from './jwt.strategy';
import { AuthController } from './auth.controller';
import { JwtAuthMiddleware } from './jwt-auth.middleware';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
	imports: [
		UsersModule,
		PassportModule,
		JwtModule.registerAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: (configService: ConfigService) => ({
				secret: configService.get<string>('JWT_SECRET'),
				signOptions: {
					expiresIn: configService.get<string>('JWT_EXPIRES_IN', '1h'),
				},
			}),
		}),
	],
	providers: [AuthService, JwtStrategy, JwtAuthMiddleware],
	controllers: [AuthController],
	exports: [AuthService, JwtModule, JwtStrategy, JwtAuthMiddleware],
})
export class AuthModule { }