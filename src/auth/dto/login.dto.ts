import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
	@ApiProperty({
		description: 'User\'s email address',
		required: true
	})
	@IsEmail()
	@IsNotEmpty()
	email: string;

	@ApiProperty({
		description: 'User\'s password',
		required: true
	})
	@IsNotEmpty()
	password: string;
}