import { Column, Model, Table, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Class } from './class.entity';
import { ApiProperty } from '@nestjs/swagger';

@Table
export class Schedule extends Model {
	@ApiProperty({
		description: 'Unique identifier for the schedule',
		example: 'a1eebc99-9c0b-4ef8-bb6d-6bb9bd380a28'
	})
	@Column({
		type: DataType.UUID,
		defaultValue: DataType.UUIDV4,
		primaryKey: true,
	})
	declare id: string;

	@ApiProperty({
		description: 'Class ID to which this schedule belongs',
	})
	@ForeignKey(() => Class)
	@Column({
		type: DataType.UUID,
		allowNull: false,
	})
	declare classId: string;

	@ApiProperty({
		description: 'Class to which this schedule belongs',
		type: () => Class
	})
	@BelongsTo(() => Class)
	class: Class;

	@ApiProperty({
		description: 'Day of the week (0=Monday to 6=Sunday)',
		example: 1,
		minimum: 0,
		maximum: 6
	})
	@Column({
		allowNull: false,
		type: DataType.INTEGER
	})
	declare dayOfWeek: number;

	@ApiProperty({
		description: 'Start time of the class (HH:MM:SS format)',
		example: '07:00:00'
	})
	@Column({
		allowNull: false,
		type: DataType.TIME,
	})
	declare startTime: string;

	@ApiProperty({
		description: 'End time of the class (HH:MM:SS format)',
		example: '08:00:00'
	})
	@Column({
		allowNull: false,
		type: DataType.TIME,
	})
	declare endTime: string;
}