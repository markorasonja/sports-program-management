import { Column, Model, Table, DataType, ForeignKey, BelongsTo, HasMany } from 'sequelize-typescript';
import { Sport } from '../../sports/entities/sport.entity';
import { User } from '../../users/entities/user.entity';
import { Schedule } from './schedule.entity';
import { Application } from '../../applications/entities/application.entity';
import { ApiProperty } from '@nestjs/swagger';

@Table
export class Class extends Model {
	@ApiProperty({
		description: 'Unique identifier for the class',
		example: '60eebc99-9c0b-4ef8-bb6d-6bb9bd380a24'
	})
	@Column({
		type: DataType.UUID,
		defaultValue: DataType.UUIDV4,
		primaryKey: true,
	})
	declare id: string;

	@ApiProperty({
		description: 'Name of the class',
	})
	@Column({
		allowNull: false,
	})
	declare name: string;

	@ApiProperty({
		description: 'Detailed description of the class',
	})
	@Column({
		type: DataType.TEXT,
	})
	declare description: string;

	@ApiProperty({
		description: 'Duration in minutes',
		example: 60,
		default: 60
	})
	@Column({
		allowNull: false,
		defaultValue: 60,
		comment: 'Duration in minutes',
	})
	declare duration: number;

	@ApiProperty({
		description: 'Maximum number of students that can enroll',
		example: 15,
		default: 20
	})
	@Column({
		allowNull: false,
		defaultValue: 20,
	})
	declare maxCapacity: number;

	@ApiProperty({
		description: 'Sport ID to which this class belongs',
	})
	@ForeignKey(() => Sport)
	@Column({
		type: DataType.UUID,
		allowNull: false,
	})
	declare sportId: string;

	@ApiProperty({
		description: 'Sport to which this class belongs',
		type: () => Sport
	})
	@BelongsTo(() => Sport)
	sport: Sport;

	@ApiProperty({
		description: 'Trainer ID who teaches this class (optional)',
		required: false
	})
	@ForeignKey(() => User)
	@Column({
		type: DataType.UUID,
		allowNull: true,
	})
	declare trainerId: string;

	@ApiProperty({
		description: 'Trainer who teaches this class',
		type: () => User,
		required: false
	})
	@BelongsTo(() => User)
	trainer: User;

	@ApiProperty({
		description: 'Schedules for this class',
		type: [Schedule]
	})
	@HasMany(() => Schedule)
	schedules: Schedule[];

	@ApiProperty({
		description: 'Applications for this class',
		type: [Application]
	})
	@HasMany(() => Application)
	applications: Application[];
}