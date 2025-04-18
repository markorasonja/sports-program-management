import { IsNotEmpty, IsUUID, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ApplicationType } from '../../common/enums/application-type.enum';

export class CreateApplicationDto {
	@ApiProperty({
		description: 'UUID of the class being applied for',
		required: true
	})
	@IsUUID(4)
	@IsNotEmpty({ message: 'Class ID is required' })
	classId: string;

	@ApiProperty({
		description: 'Type of application (student enrollment or trainer assignment)',
		enum: ApplicationType,
		default: ApplicationType.STUDENT_ENROLLMENT,
		required: false
	})
	@IsEnum(ApplicationType)
	@IsOptional()
	type?: ApplicationType = ApplicationType.STUDENT_ENROLLMENT;
}