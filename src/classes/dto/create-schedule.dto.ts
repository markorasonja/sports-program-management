import { IsNotEmpty, IsNumber, IsString, IsUUID, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateScheduleDto {
	@ApiProperty({
		description: 'UUID of the class for this schedule',
		required: true
	})
	@IsUUID(4)
	@IsNotEmpty({ message: 'Class ID is required' })
	classId: string;

	@ApiProperty({
		description: 'Day of the week (0=Monday to 6=Sunday)',
		minimum: 0,
		maximum: 6,
		required: true
	})
	@IsNumber()
	@Min(0, { message: 'Day of week must be between 0 (Monday) and 6 (Sunday)' })
	@Max(6, { message: 'Day of week must be between 0 (Monday) and 6 (Sunday)' })
	@IsNotEmpty({ message: 'Day of week is required' })
	dayOfWeek: number;

	@ApiProperty({
		description: 'Start time of the class (HH:MM:SS format)',
		required: true
	})
	@IsString()
	@IsNotEmpty({ message: 'Start time is required' })
	startTime: string;

	@ApiProperty({
		description: 'End time of the class (HH:MM:SS format)',
		required: true
	})
	@IsString()
	@IsNotEmpty({ message: 'End time is required' })
	endTime: string;
}