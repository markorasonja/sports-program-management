import { IsNotEmpty, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ApplicationStatus } from '../../common/enums/application-status.enum';

export class UpdateApplicationStatusDto {
	@ApiProperty({
		description: 'Status of the application',
		enum: ApplicationStatus,
		required: true
	})
	@IsEnum(ApplicationStatus, { message: 'Invalid status. Must be one of: pending, approved, rejected' })
	@IsNotEmpty({ message: 'Status is required' })
	status: ApplicationStatus;
}