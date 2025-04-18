import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Sport } from './entities/sport.entity';
import { SportsService } from './sports.service';
import { SportsController } from './sports.controller';
@Module({
	imports: [SequelizeModule.forFeature([Sport])],
	exports: [SequelizeModule, SportsService],
	providers: [
		{
			provide: 'SPORT_REPOSITORY',
			useValue: Sport,
		},
		SportsService,
	],
	controllers: [SportsController],
})

export class SportsModule { }
