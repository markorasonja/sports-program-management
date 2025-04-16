import { Column, Model, Table, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { User } from '../../users/entities/user.entity';
import { Class } from '../../classes/entities/class.entity';

export enum ApplicationStatus {
	PENDING = 'pending',
	APPROVED = 'approved',
	REJECTED = 'rejected',
}

@Table
export class Application extends Model {
	@Column({
		type: DataType.UUID,
		defaultValue: DataType.UUIDV4,
		primaryKey: true,
	})
	declare id: string;

	@ForeignKey(() => User)
	@Column({
		type: DataType.UUID,
		allowNull: false,
	})
	userId: string;

	@BelongsTo(() => User)
	user: User;

	@ForeignKey(() => Class)
	@Column({
		type: DataType.UUID,
		allowNull: false,
	})
	classId: string;

	@BelongsTo(() => Class)
	class: Class;

	@Column({
		type: DataType.DATE,
		allowNull: false,
		defaultValue: DataType.NOW,
	})
	applicationDate: Date;

	@Column({
		type: DataType.ENUM(...Object.values(ApplicationStatus)),
		allowNull: false,
		defaultValue: ApplicationStatus.PENDING,
	})
	status: ApplicationStatus;
}