import { IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSportDto {
	@ApiProperty({
		description: 'Name of the sport',
		required: true
	})
	@IsString()
	@IsNotEmpty({ message: 'Sport name is required' })
	name: string;

	@ApiProperty({
		description: 'Detailed description of the sport',
		required: false
	})
	@IsString()
	@IsOptional()
	description?: string;
}