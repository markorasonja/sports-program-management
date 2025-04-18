import { IsNumber, IsString, IsOptional, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateScheduleDto {
	@ApiProperty({
		description: 'Day of the week (0=Monday to 6=Sunday)',
		minimum: 0,
		maximum: 6,
		required: false
	})
	@IsNumber()
	@Min(0, { message: 'Day of week must be between 0 (Monday) and 6 (Sunday)' })
	@Max(6, { message: 'Day of week must be between 0 (Monday) and 6 (Sunday)' })
	@IsOptional()
	dayOfWeek?: number;

	@ApiProperty({
		description: 'Start time of the class (HH:MM:SS format)',
		required: false
	})
	@IsString()
	@IsOptional()
	startTime?: string;

	@ApiProperty({
		description: 'End time of the class (HH:MM:SS format)',
		required: false
	})
	@IsString()
	@IsOptional()
	endTime?: string;
}