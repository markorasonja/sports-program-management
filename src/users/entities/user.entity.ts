import { Column, Model, Table, DataType } from 'sequelize-typescript';
import { Role } from '../../common/enums/role.enum';
import { ApiProperty } from '@nestjs/swagger';

@Table
export class User extends Model {
	@ApiProperty({
		description: 'Unique identifier for the user',
		example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'
	})
	@Column({
		type: DataType.UUID,
		defaultValue: DataType.UUIDV4,
		primaryKey: true,
	})
	declare id: string;

	@ApiProperty({
		description: 'User\'s first name'
	})
	@Column({
		allowNull: false,
	})
	declare firstName: string;

	@ApiProperty({
		description: 'User\'s last name'
	})
	@Column({
		allowNull: false,
	})
	declare lastName: string;

	@ApiProperty({
		description: 'User\'s email address (unique)'
	})
	@Column({
		allowNull: false,
		unique: true,
	})
	declare email: string;

	@ApiProperty({
		description: 'Hashed password of the user',
		example: '$2b$10$7EoQtN/7SJeQ4qiwGAOzfuRpQcDSPTWnNYlEA2syAUzeRFrQ9r8dC'
	})
	@Column({
		allowNull: false,
	})
	declare password: string;

	@ApiProperty({
		description: 'User\'s date of birth',
		example: '1990-01-15'
	})
	@Column({
		type: DataType.DATEONLY,
	})
	declare dateOfBirth: Date;

	@ApiProperty({
		description: 'User\'s biographical information'
	})
	@Column({
		type: DataType.TEXT,
	})
	declare about: string;

	@ApiProperty({
		description: 'User\'s role in the system',
		enum: Role,
		example: 'student'
	})
	@Column({
		type: DataType.ENUM(...Object.values(Role)),
		defaultValue: Role.STUDENT,
	})
	declare role: Role;

	@ApiProperty({
		description: 'User\'s phone number',
		example: '+1234567890'
	})
	@Column
	declare phoneNumber: string;
}
