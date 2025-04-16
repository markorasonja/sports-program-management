import { Column, Model, Table, DataType, HasMany } from 'sequelize-typescript';
import { Class } from '../../classes/entities/class.entity';

@Table
export class Sport extends Model {
	@Column({
		type: DataType.UUID,
		defaultValue: DataType.UUIDV4,
		primaryKey: true,
	})
	declare id: string;

	@Column({
		allowNull: false,
		unique: true,
	})
	name: string;

	@Column({
		type: DataType.TEXT,
	})
	description: string;

	@Column({
		allowNull: false,
		defaultValue: true,
	})
	isActive: boolean;

	@HasMany(() => Class)
	classes: Class[];
}