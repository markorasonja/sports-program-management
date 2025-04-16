import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Class } from './entities/class.entity';
import { Schedule } from './entities/schedule.entity';

@Module({
	imports: [SequelizeModule.forFeature([Class, Schedule])],
	exports: [SequelizeModule],
	providers: [],
	controllers: [],
})

export class ClassesModule { }
