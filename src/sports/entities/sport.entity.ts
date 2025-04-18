import { Column, Model, Table, DataType, HasMany } from 'sequelize-typescript';
import { Class } from '../../classes/entities/class.entity';
import { ApiProperty } from '@nestjs/swagger';

@Table
export class Sport extends Model {
	@ApiProperty({
		description: 'Unique identifier for the sport',
		example: '10eebc99-9c0b-4ef8-bb6d-6bb9bd380a19'
	})
	@Column({
		type: DataType.UUID,
		defaultValue: DataType.UUIDV4,
		primaryKey: true,
	})
	declare id: string;

	@ApiProperty({
		description: 'Name of the sport (unique)',
	})
	@Column({
		allowNull: false,
		unique: true,
	})
	declare name: string;

	@ApiProperty({
		description: 'Detailed description of the sport'
	})
	@Column({
		type: DataType.TEXT,
	})
	declare description: string;

	@ApiProperty({
		description: 'Classes associated with this sport',
		type: [Class]
	})
	@HasMany(() => Class)
	classes: Class[];
}