import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Application } from './entities/application.entity';
import { ApplicationsService } from './applications.service';
import { ApplicationsController } from './applications.controller';
import { UsersModule } from '../users/users.module';
import { ClassesModule } from '../classes/classes.module';

@Module({
	imports: [
		SequelizeModule.forFeature([Application]),
		UsersModule,
		ClassesModule
	],
	exports: [SequelizeModule, ApplicationsService],
	providers: [
		{
			provide: 'APPLICATION_REPOSITORY',
			useValue: Application,
		},
		ApplicationsService,
	],
	controllers: [ApplicationsController],
})

export class ApplicationsModule { }
