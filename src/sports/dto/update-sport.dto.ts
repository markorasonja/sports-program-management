import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateSportDto {
	@ApiProperty({
		description: 'Name of the sport',
		required: false
	})
	@IsString()
	@IsOptional()
	name?: string;

	@ApiProperty({
		description: 'Detailed description of the sport',
		required: false
	})
	@IsString()
	@IsOptional()
	description?: string;
}