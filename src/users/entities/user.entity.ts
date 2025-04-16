import { Column, Model, Table, DataType } from 'sequelize-typescript';
import { Role } from '../../common/enums/role.enum';

@Table
export class User extends Model {
	@Column({
		type: DataType.UUID,
		defaultValue: DataType.UUIDV4,
		primaryKey: true,
	})
	declare id: string;

	@Column({
		allowNull: false,
	})
	firstName: string;

	@Column({
		allowNull: false,
	})
	lastName: string;

	@Column({
		allowNull: false,
		unique: true,
	})
	email: string;

	@Column({
		allowNull: false,
	})
	password: string;

	@Column({
		type: DataType.DATEONLY,
	})
	dateOfBirth: Date;

	@Column({
		type: DataType.TEXT,
	})
	about: string;

	@Column({
		type: DataType.ENUM(...Object.values(Role)),
		allowNull: false,
		defaultValue: Role.STUDENT,
	})
	role: Role;

	@Column
	phoneNumber: string;
}
