import { IsString, IsNumber, IsOptional, IsUUID, Min, Max, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateClassDto {
	@ApiProperty({
		description: 'Name of the class',
		required: false
	})
	@IsString()
	@IsOptional()
	name?: string;

	@ApiProperty({
		description: 'Detailed description of the class',
		required: false
	})
	@IsString()
	@IsOptional()
	description?: string;

	@ApiProperty({
		description: 'Duration of the class in minutes',
		required: false
	})
	@IsNumber()
	@IsOptional()
	duration?: number;

	@ApiProperty({
		description: 'Maximum number of students that can enroll in this class',
		minimum: 1,
		maximum: 50,
		required: false
	})
	@IsNumber()
	@Min(1, { message: 'Maximum capacity must be at least 1' })
	@Max(50, { message: 'Maximum capacity cannot exceed 50' })
	@IsOptional()
	maxCapacity?: number;

	@ApiProperty({
		description: 'UUID of the sport this class is associated with',
		required: false
	})
	@IsUUID(4)
	@IsOptional()
	sportId?: string;

	@ApiProperty({
		description: 'UUID of the trainer assigned to this class',
		required: false,
		nullable: true
	})
	@IsUUID(4)
	@IsOptional()
	trainerId?: string;
}