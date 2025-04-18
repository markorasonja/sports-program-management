import {
	Controller, UseGuards, Get, Put, Request, ForbiddenException, NotFoundException,
	Param, Body,
	HttpException,
	HttpStatus,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiBody } from '@nestjs/swagger';
import { RolesGuard } from "../auth/roles.guard";
import { UsersService } from "./users.service";
import { Role } from "../common/enums/role.enum";
import { UpdateUserDto } from "./dto/update-user.dto";
import { Roles } from "../auth/roles.decorator";
import { UpdateRoleDto } from "./dto/update-role.dto";
import { User } from "./entities/user.entity";

@ApiTags('users')
@ApiBearerAuth()
@Controller("users")
@UseGuards(RolesGuard)
export class UsersController {
	constructor(private usersService: UsersService) { }

	@Get()
	@Roles(Role.ADMIN)
	@ApiOperation({ summary: 'Get all users', description: 'Retrieves a list of all users (Admin only)' })
	@ApiResponse({ status: 200, description: 'List of users retrieved successfully', type: [User] })
	@ApiResponse({ status: 401, description: 'Unauthorized' })
	@ApiResponse({ status: 403, description: 'Forbidden - requires admin role' })
	@ApiResponse({ status: 500, description: 'Internal server error' })
	async getAllUsers() {
		try {
			const users = await this.usersService.findAll();
			return users.map(user => {
				const { password, ...data } = user.toJSON();
				return data;
			}
			);
		} catch (error) {
			throw new HttpException(
				error.message,
				HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}

	@Get(':id')
	@ApiOperation({ summary: 'Get user by ID', description: 'Retrieves a specific user by ID (admins can view any user, others can only view themselves)' })
	@ApiParam({ name: 'id', description: 'The UUID of the user' })
	@ApiResponse({ status: 200, description: 'User found', type: User })
	@ApiResponse({ status: 401, description: 'Unauthorized' })
	@ApiResponse({ status: 403, description: 'Forbidden - cannot view other users\' data' })
	@ApiResponse({ status: 404, description: 'User not found' })
	async getUserById(@Param('id') id: string, @Request() req) {
		try {
			if (req.user.role !== Role.ADMIN && req.user.sub !== id) {
				throw new ForbiddenException('Access denied');
			}

			const user = await this.usersService.findOne(id);

			if (!user) {
				throw new NotFoundException('User not found');
			}

			const { password, ...data } = user.toJSON();
			return data;
		} catch (error) {
			throw error;
		}
	}

	@Put(':id')
	@ApiOperation({ summary: 'Update user', description: 'Updates a user\'s profile (admins can update any user, others can only update themselves)' })
	@ApiParam({ name: 'id', description: 'The UUID of the user' })
	@ApiBody({ type: UpdateUserDto })
	@ApiResponse({ status: 200, description: 'User updated successfully', type: User })
	@ApiResponse({ status: 400, description: 'Bad request - invalid data or email already exists' })
	@ApiResponse({ status: 401, description: 'Unauthorized' })
	@ApiResponse({ status: 403, description: 'Forbidden - cannot update other users' })
	@ApiResponse({ status: 404, description: 'User not found' })
	async updateUser(
		@Param('id') id: string,
		@Body() updateUserDto: UpdateUserDto,
		@Request() req,
	) {
		try {
			if (req.user.role !== Role.ADMIN && req.user.sub !== id) {
				throw new ForbiddenException('Access denied');
			}

			const user = await this.usersService.findOne(id);

			if (!user) {
				throw new NotFoundException('User not found');
			}

			/* don't allow to update role, use specified api call */
			updateUserDto.role = user.role;

			const updatedUser = await this.usersService.update(id, updateUserDto);
			const { password, ...data } = updatedUser.toJSON();
			return data;
		} catch (error) {
			throw error;
		}
	}

	@Put(':id/role')
	@Roles(Role.ADMIN)
	@ApiOperation({ summary: 'Update user role', description: 'Updates a user\'s role (Admin only)' })
	@ApiParam({ name: 'id', description: 'The UUID of the user' })
	@ApiBody({ type: UpdateRoleDto })
	@ApiResponse({ status: 200, description: 'User role updated successfully', type: User })
	@ApiResponse({ status: 401, description: 'Unauthorized' })
	@ApiResponse({ status: 403, description: 'Forbidden - requires admin role' })
	@ApiResponse({ status: 404, description: 'User not found' })
	async updateUserRole(
		@Param('id') id: string,
		@Body() updateRoleDto: UpdateRoleDto,
	) {
		try {
			const user = await this.usersService.findOne(id);

			if (!user) {
				throw new NotFoundException('User not found');
			}

			const updatedUser = await this.usersService.updateRole(id, updateRoleDto);
			const { password, ...data } = updatedUser.toJSON();
			return data;
		} catch (error) {
			throw error;
		}
	}
}