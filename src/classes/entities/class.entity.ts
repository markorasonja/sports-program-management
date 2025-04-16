import { Column, Model, Table, DataType, ForeignKey, BelongsTo, HasMany } from 'sequelize-typescript';
import { Sport } from '../../sports/entities/sport.entity';
import { User } from '../../users/entities/user.entity';
import { Schedule } from './schedule.entity';
import { Application } from '../../applications/entities/application.entity';

@Table
export class Class extends Model {
	@Column({
		type: DataType.UUID,
		defaultValue: DataType.UUIDV4,
		primaryKey: true,
	})
	declare id: string;

	@Column({
		allowNull: false,
	})
	name: string;

	@Column({
		type: DataType.TEXT,
	})
	description: string;

	@Column({
		allowNull: false,
		defaultValue: 60,
		comment: 'Duration in minutes',
	})
	duration: number;

	@Column({
		allowNull: false,
		defaultValue: 20,
	})
	maxCapacity: number;

	@Column({
		allowNull: false,
		defaultValue: true,
	})
	isActive: boolean;

	@ForeignKey(() => Sport)
	@Column({
		type: DataType.UUID,
		allowNull: false,
	})
	sportId: string;

	@BelongsTo(() => Sport)
	sport: Sport;

	@ForeignKey(() => User)
	@Column({
		type: DataType.UUID,
	})
	trainerId: string;

	@BelongsTo(() => User)
	trainer: User;

	@HasMany(() => Schedule)
	schedules: Schedule[];

	@HasMany(() => Application)
	applications: Application[];
}