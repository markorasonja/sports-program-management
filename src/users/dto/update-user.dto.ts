import {
	IsEmail, IsString, MinLength, IsOptional,
	IsDateString, IsEnum
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../../common/enums/role.enum';

export class UpdateUserDto {
	@ApiProperty({
		description: 'User\'s first name',
		required: false
	})
	@IsString()
	@IsOptional()
	firstName?: string;

	@ApiProperty({
		description: 'User\'s last name',
		required: false
	})
	@IsString()
	@IsOptional()
	lastName?: string;

	@ApiProperty({
		description: 'User\'s email address (must be unique)',
		required: false
	})
	@IsEmail()
	@IsOptional()
	email?: string;

	@ApiProperty({
		description: 'User\'s new password (minimum 8 characters)',
		example: 'newpassword123',
		required: false
	})
	@IsString()
	@MinLength(8)
	@IsOptional()
	password?: string;

	@ApiProperty({
		description: 'User\'s date of birth',
		example: '1990-01-15',
		required: false
	})
	@IsDateString()
	@IsOptional()
	dateOfBirth?: Date;

	@ApiProperty({
		description: 'User\'s biographical information',
		required: false
	})
	@IsString()
	@IsOptional()
	about?: string;

	@ApiProperty({
		description: 'User\'s role in the system',
		enum: Role,
		example: 'student',
		required: false
	})
	@IsEnum(Role)
	@IsOptional()
	role?: Role;

	@ApiProperty({
		description: 'User\'s phone number',
		example: '+1234567890',
		required: false
	})
	@IsString()
	@IsOptional()
	phoneNumber?: string;
}