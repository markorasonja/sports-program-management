import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommonModule } from './common/common.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { SportsModule } from './sports/sports.module';
import { ClassesModule } from './classes/classes.module';
import { ApplicationsModule } from './applications/applications.module';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
	imports: [ConfigModule.forRoot({
		isGlobal: true,
	}),
		CommonModule, AuthModule, UsersModule, SportsModule, ClassesModule, ApplicationsModule,
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
export class AppModule { }
