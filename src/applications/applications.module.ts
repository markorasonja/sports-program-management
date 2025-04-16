import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Application } from './entities/application.entity';

@Module({
	imports: [SequelizeModule.forFeature([Application])],
	exports: [SequelizeModule],
	providers: [],
	controllers: [],
})

export class ApplicationsModule { }
