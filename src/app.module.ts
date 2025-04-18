import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { SportsModule } from './sports/sports.module';
import { ClassesModule } from './classes/classes.module';
import { ApplicationsModule } from './applications/applications.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { JwtAuthMiddleware } from './auth/jwt-auth.middleware';

@Module({
	imports: [ConfigModule.forRoot({
		isGlobal: true,
	}),
		AuthModule, UsersModule, SportsModule, ClassesModule, ApplicationsModule,
	SequelizeModule.forRoot({
		dialect: 'mysql',
		host: process.env.DB_HOST || 'localhost',
		port: parseInt(process.env.DB_PORT || '3306', 10),
		username: process.env.DB_USERNAME || 'root',
		password: process.env.DB_PASSWORD,
		database: process.env.DB_NAME || 'sports_management',
		autoLoadModels: true,
		synchronize: true,
	}),
	],
	controllers: [AppController],
	providers: [AppService],
})

export class AppModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer
			.apply(JwtAuthMiddleware)
			.exclude(
				{ path: 'auth/login', method: RequestMethod.POST },
				{ path: 'auth/register', method: RequestMethod.POST }
			)
			.forRoutes('*');
	}
}
