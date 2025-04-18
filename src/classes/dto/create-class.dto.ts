import { IsNotEmpty, IsString, IsNumber, IsOptional, IsUUID, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateClassDto {
	@ApiProperty({
		description: 'Name of the class',
		required: true
	})
	@IsString()
	@IsNotEmpty({ message: 'Class name is required' })
	name: string;

	@ApiProperty({
		description: 'Detailed description of the class',
		required: false
	})
	@IsString()
	@IsOptional()
	description?: string;

	@ApiProperty({
		description: 'Duration of the class in minutes',
		default: 60,
		required: false
	})
	@IsNumber()
	@IsOptional()
	duration?: number = 60;

	@ApiProperty({
		description: 'Maximum number of students that can enroll in this class',
		default: 20,
		minimum: 1,
		maximum: 50,
		required: false
	})
	@IsNumber()
	@Min(1, { message: 'Maximum capacity must be at least 1' })
	@Max(50, { message: 'Maximum capacity cannot exceed 50' })
	@IsOptional()
	maxCapacity?: number = 20;

	@ApiProperty({
		description: 'UUID of the sport this class is associated with',
		required: true
	})
	@IsUUID(4)
	@IsNotEmpty({ message: 'Sport ID is required' })
	sportId: string;

	@ApiProperty({
		description: 'UUID of the trainer assigned to this class (optional)',
		required: false
	})
	@IsUUID(4)
	@IsOptional()
	trainerId?: string;
}