import { IsEnum, IsNotEmpty } from 'class-validator';
import { Role } from '../../common/enums/role.enum';

export class UpdateRoleDto {
	@IsEnum(Role, { message: 'Invalid role. Must be one of: student, trainer, admin' })
	@IsNotEmpty({ message: 'Role is required' })
	role: Role;
}