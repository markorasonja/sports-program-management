import { Column, Model, Table, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { User } from '../../users/entities/user.entity';
import { Class } from '../../classes/entities/class.entity';
import { ApplicationStatus } from '../../common/enums/application-status.enum';
import { ApplicationType } from '../../common/enums/application-type.enum';
import { ApiProperty } from '@nestjs/swagger';

@Table
export class Application extends Model {
	@ApiProperty({
		description: 'Unique identifier for the application',
		example: 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a38'
	})
	@Column({
		type: DataType.UUID,
		defaultValue: DataType.UUIDV4,
		primaryKey: true,
	})
	declare id: string;

	@ApiProperty({
		description: 'User ID of the applicant',
	})
	@ForeignKey(() => User)
	@Column({
		type: DataType.UUID,
		allowNull: false,
	})
	declare userId: string;

	@ApiProperty({
		description: 'User who applied',
		type: () => User
	})
	@BelongsTo(() => User)
	user: User;

	@ApiProperty({
		description: 'Class ID to which the application is made',
	})
	@ForeignKey(() => Class)
	@Column({
		type: DataType.UUID,
		allowNull: false,
	})
	declare classId: string;

	@ApiProperty({
		description: 'Class to which the application is made',
		type: () => Class
	})
	@BelongsTo(() => Class)
	class: Class;

	@ApiProperty({
		description: 'Date when the application was submitted',
		example: '2025-04-18T12:00:00Z'
	})
	@Column({
		type: DataType.DATE,
		allowNull: false,
		defaultValue: DataType.NOW,
	})
	declare applicationDate: Date;

	@ApiProperty({
		description: 'Status of the application',
		enum: ApplicationStatus,
		example: 'pending'
	})
	@Column({
		type: DataType.ENUM(...Object.values(ApplicationStatus)),
		allowNull: false,
		defaultValue: ApplicationStatus.PENDING,
	})
	declare status: ApplicationStatus;

	@ApiProperty({
		description: 'Type of the application',
		enum: ApplicationType,
		example: 'student_enrollment'
	})
	@Column({
		type: DataType.ENUM(...Object.values(ApplicationType)),
		allowNull: false,
		defaultValue: ApplicationType.STUDENT_ENROLLMENT,
	})
	declare type: ApplicationType;
}