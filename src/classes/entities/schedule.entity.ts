import { Column, Model, Table, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Class } from './class.entity';

@Table
export class Schedule extends Model {
	@Column({
		type: DataType.UUID,
		defaultValue: DataType.UUIDV4,
		primaryKey: true,
	})
	declare id: string;

	@ForeignKey(() => Class)
	@Column({
		type: DataType.UUID,
		allowNull: false,
	})
	classId: string;

	@BelongsTo(() => Class)
	class: Class;

	@Column({
		allowNull: false,
		type: DataType.INTEGER
	})
	dayOfWeek: number;

	@Column({
		allowNull: false,
		type: DataType.TIME,
	})
	startTime: string;

	@Column({
		allowNull: false,
		type: DataType.TIME,
	})
	endTime: string;
}