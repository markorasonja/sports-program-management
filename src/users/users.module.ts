import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';

@Module({
	imports: [SequelizeModule.forFeature([User])],
	exports: [SequelizeModule, UsersService],
	providers: [
		{
			provide: 'USER_REPOSITORY',
			useValue: User,
		},
		UsersService,
	],
	controllers: [UsersController],
})

export class UsersModule { }
