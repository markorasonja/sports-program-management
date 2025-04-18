import { Injectable, Inject } from "@nestjs/common";
import { User } from "./entities/user.entity";
import { CreateUserDto } from "./dto/create-user.dto";
import * as bcrypt from "bcrypt";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UpdateRoleDto } from "./dto/update-role.dto";

@Injectable()
export class UsersService {
	constructor(
		@Inject('USER_REPOSITORY')
		private usersRepository: typeof User,
	) { }

	async create(createUserDto: CreateUserDto): Promise<User> {
		/* uniqueness on email */
		const existingUser = await this.usersRepository.findOne({
			where: {
				email: createUserDto.email,
			},
		});

		if (existingUser) {
			throw new Error("Email already exists");
		}

		createUserDto.password = await this.hashPassword(createUserDto.password);

		return this.usersRepository.create({
			...createUserDto,
		})
	}

	async findAll(): Promise<User[]> {
		return this.usersRepository.findAll();
	}

	async findOne(id: string): Promise<User> {
		const user = await this.usersRepository.findByPk(id);
		if (!user) {
			throw new Error("User not found");
		}
		return user;
	}

	async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
		const user = await this.usersRepository.findByPk(id);
		if (!user) {
			throw new Error("User not found");
		}

		if (updateUserDto.email && updateUserDto.email !== user.email) {
			const existingUser = await this.usersRepository.findOne({
				where: {
					email: updateUserDto.email,
				},
			});
			if (existingUser) {
				throw new Error("Email already exists");
			}
		}

		if (updateUserDto.password) {
			updateUserDto.password = await this.hashPassword(updateUserDto.password);
		}

		await this.usersRepository.update(updateUserDto, {
			where: {
				id,
			},
		});

		return this.findOne(id);

	}

	async updateRole(id: string, updateRoleDto: UpdateRoleDto): Promise<User> {
		const user = await this.usersRepository.findByPk(id);
		if (!user) {
			throw new Error("User not found");
		}

		await this.usersRepository.update(updateRoleDto, {
			where: {
				id,
			},
		});

		return this.findOne(id);
	}

	async findOneByEmail(email: string): Promise<User> {
		const user = await this.usersRepository.findOne({
			where: {
				email,
			},
		});

		if (!user) {
			throw new Error("User not found");
		}

		return user;
	}


	async hashPassword(password: string): Promise<string> {
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);
		return hashedPassword;
	}

	async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
		return bcrypt.compare(password, hashedPassword);
	}

}