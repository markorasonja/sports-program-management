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
	declare firstName: string;

	@Column({
		allowNull: false,
	})
	declare lastName: string;

	@Column({
		allowNull: false,
		unique: true,
	})
	declare email: string;

	@Column({
		allowNull: false,
	})
	declare password: string;

	@Column({
		type: DataType.DATEONLY,
	})
	declare dateOfBirth: Date;

	@Column({
		type: DataType.TEXT,
	})
	declare about: string;

	@Column({
		type: DataType.ENUM(...Object.values(Role)),
		defaultValue: Role.STUDENT,
	})
	declare role: Role;

	@Column
	declare phoneNumber: string;
}
