import { IsEnum, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../../common/enums/role.enum';

export class UpdateRoleDto {
	@ApiProperty({
		description: 'User role',
		enum: Role,
		required: true
	})
	@IsEnum(Role, { message: 'Invalid role. Must be one of: student, trainer, admin' })
	@IsNotEmpty({ message: 'Role is required' })
	role: Role;
}