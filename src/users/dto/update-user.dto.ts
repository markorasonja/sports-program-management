import {
	IsEmail, IsString, MinLength, IsOptional,
	IsDateString, IsEnum
} from 'class-validator';
import { Role } from '../../common/enums/role.enum';

export class UpdateUserDto {
	@IsString()
	@IsOptional()
	firstName?: string;

	@IsString()
	@IsOptional()
	lastName?: string;

	@IsEmail()
	@IsOptional()
	email?: string;

	@IsString()
	@MinLength(8)
	@IsOptional()
	password?: string;

	@IsDateString()
	@IsOptional()
	dateOfBirth?: Date;

	@IsString()
	@IsOptional()
	about?: string;

	@IsEnum(Role)
	@IsOptional()
	role?: Role;

	@IsString()
	@IsOptional()
	phoneNumber?: string;
}