import {
	IsEmail, IsNotEmpty, IsString, MinLength
	, IsOptional, IsDateString, IsEnum
} from 'class-validator';
import { Role } from '../../common/enums/role.enum';

export class CreateUserDto {
	@IsString()
	@IsNotEmpty()
	firstName: string;

	@IsString()
	@IsNotEmpty()
	lastName: string;

	@IsEmail()
	@IsNotEmpty()
	email: string;

	@IsString()
	@MinLength(8)
	@IsNotEmpty()
	password: string;

	@IsDateString()
	@IsOptional()
	dateOfBirth?: Date;

	@IsString()
	@IsOptional()
	about?: string;

	@IsString()
	@IsOptional()
	phoneNumber?: string;
}