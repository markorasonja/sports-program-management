import {
	Controller, UseGuards, Get, Put, Request, ForbiddenException, NotFoundException,
	Param, Body,
	HttpException,
	HttpStatus,
} from "@nestjs/common";
import { RolesGuard } from "src/auth/roles.guard";
import { UsersService } from "./users.service";
import { Role } from "src/common/enums/role.enum";
import { UpdateUserDto } from "./dto/update-user.dto";
import { Roles } from "src/auth/roles.decorator";
import { UpdateRoleDto } from "./dto/update-role.dto";


@Controller("users")
@UseGuards(RolesGuard)
export class UsersController {
	constructor(private usersService: UsersService) { }

	@Get()
	@Roles(Role.ADMIN)
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