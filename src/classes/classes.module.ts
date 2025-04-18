import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Class } from './entities/class.entity';
import { Schedule } from './entities/schedule.entity';
import { ClassesService } from './classes.service';
import { ClassesController } from './classes.controller';
import { UsersModule } from '../users/users.module';
import { SportsModule } from '../sports/sports.module';
import { User } from '../users/entities/user.entity';
import { Sport } from '../sports/entities/sport.entity';

@Module({
	imports: [
		SequelizeModule.forFeature([Class, Schedule]),
		UsersModule,
		SportsModule
	],
	exports: [SequelizeModule, ClassesService,
		{
			provide: 'CLASS_REPOSITORY',
			useValue: Class,
		}
	],
	providers: [
		{
			provide: 'CLASS_REPOSITORY',
			useValue: Class,
		},
		{
			provide: 'SCHEDULE_REPOSITORY',
			useValue: Schedule,
		},
		{
			provide: 'USER_REPOSITORY',
			useValue: User,
		},
		{
			provide: 'SPORT_REPOSITORY',
			useValue: Sport,
		},
		ClassesService,
	],
	controllers: [ClassesController],
})

export class ClassesModule { }
