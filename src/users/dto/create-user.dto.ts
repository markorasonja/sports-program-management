import {
	IsEmail, IsNotEmpty, IsString, MinLength,
	IsOptional, IsDateString, IsEnum
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
	@ApiProperty({
		description: 'User\'s first name',
	})
	@IsString()
	@IsNotEmpty()
	firstName: string;

	@ApiProperty({
		description: 'User\'s last name',
	})
	@IsString()
	@IsNotEmpty()
	lastName: string;

	@ApiProperty({
		description: 'User\'s email address (must be unique)',
	})
	@IsEmail()
	@IsNotEmpty()
	email: string;

	@ApiProperty({
		description: 'User\'s password (minimum 8 characters)',
		example: 'password123'
	})
	@IsString()
	@MinLength(8)
	@IsNotEmpty()
	password: string;

	@ApiProperty({
		description: 'User\'s date of birth (optional)',
		example: '1990-01-15',
		required: false
	})
	@IsDateString()
	@IsOptional()
	dateOfBirth?: Date;

	@ApiProperty({
		description: 'User\'s biographical information (optional)',
		required: false
	})
	@IsString()
	@IsOptional()
	about?: string;

	@ApiProperty({
		description: 'User\'s phone number (optional)',
		example: '+1234567890',
		required: false
	})
	@IsString()
	@IsOptional()
	phoneNumber?: string;
}