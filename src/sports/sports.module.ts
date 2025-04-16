import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Sport } from './entities/sport.entity';

@Module({
	imports: [SequelizeModule.forFeature([Sport])],
	exports: [SequelizeModule],
	providers: [],
	controllers: [],
})

export class SportsModule { }
