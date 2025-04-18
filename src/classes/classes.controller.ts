import {
	Controller, Get, Post, Put, Delete,
	Body, Param, UseGuards, Query,
	HttpException, HttpStatus, Request
} from '@nestjs/common';
import { ClassesService } from './classes.service';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiQuery } from '@nestjs/swagger';
import { Class } from './entities/class.entity';
import { Schedule } from './entities/schedule.entity';

@ApiTags('classes')
@ApiBearerAuth()
@Controller('classes')
@UseGuards(RolesGuard)
export class ClassesController {
	constructor(private classesService: ClassesService) { }

	@Post()
	@Roles(Role.ADMIN)
	@ApiOperation({ summary: 'Create a new class', description: 'Creates a new class (Admin)' })
	@ApiResponse({ status: 201, description: 'The class has been successfully created', type: Class })
	@ApiResponse({ status: 400, description: 'Bad request - invalid data' })
	@ApiResponse({ status: 401, description: 'Unauthorized' })
	@ApiResponse({ status: 403, description: 'Forbidden - requires admin role' })
	async create(@Body() createClassDto: CreateClassDto) {
		try {
			return await this.classesService.create(createClassDto);
		} catch (error) {
			throw new HttpException(
				error.message || 'Failed to create class',
				error.status || HttpStatus.BAD_REQUEST,
			);
		}
	}

	@Get()
	@ApiOperation({ summary: 'Get all classes', description: 'Retrieves a list of all classes with optional sport filtering' })
	@ApiQuery({ name: 'sport', description: 'Filter classes by sport name (optional)', required: false })
	@ApiResponse({ status: 200, description: 'List of classes retrieved successfully', type: [Class] })
	@ApiResponse({ status: 500, description: 'Internal server error' })
	async findAll(@Query('sport') sportKeyword?: string) {
		try {
			const classes = sportKeyword
				? await this.classesService.searchClassesBySport(sportKeyword)
				: await this.classesService.findAll();
			return classes;
		} catch (error) {
			throw new HttpException(
				error.message || 'Failed to fetch classes',
				HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}

	@Get(':id')
	@ApiOperation({ summary: 'Get a class by ID', description: 'Retrieves information about a specific class' })
	@ApiParam({ name: 'id', description: 'The UUID of the class' })
	@ApiResponse({ status: 200, description: 'Class found', type: Class })
	@ApiResponse({ status: 404, description: 'Class not found' })
	@ApiResponse({ status: 500, description: 'Internal server error' })
	async findOne(@Param('id') id: string) {
		try {
			return await this.classesService.findOne(id);
		} catch (error) {
			throw new HttpException(
				error.message || 'Failed to fetch class',
				error.status || HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}

	@Put(':id')
	@Roles(Role.ADMIN)
	@ApiOperation({ summary: 'Update a class', description: 'Updates a class (Admin)' })
	@ApiParam({ name: 'id', description: 'The UUID of the class' })
	@ApiResponse({ status: 200, description: 'Class updated successfully', type: Class })
	@ApiResponse({ status: 400, description: 'Bad request - invalid data' })
	@ApiResponse({ status: 401, description: 'Unauthorized' })
	@ApiResponse({ status: 403, description: 'Forbidden - requires admin or trainer role' })
	@ApiResponse({ status: 404, description: 'Class not found' })
	async update(@Param('id') id: string, @Body() updateClassDto: UpdateClassDto) {
		try {
			return await this.classesService.update(id, updateClassDto);
		} catch (error) {
			throw new HttpException(
				error.message || 'Failed to update class',
				error.status || HttpStatus.BAD_REQUEST,
			);
		}
	}

	@Delete(':id')
	@Roles(Role.ADMIN)
	@ApiOperation({ summary: 'Delete a class', description: 'Deletes a class (Admin)' })
	@ApiParam({ name: 'id', description: 'The UUID of the class' })
	@ApiResponse({ status: 200, description: 'Class deleted successfully' })
	@ApiResponse({ status: 401, description: 'Unauthorized' })
	@ApiResponse({ status: 403, description: 'Forbidden - requires admin role' })
	@ApiResponse({ status: 404, description: 'Class not found' })
	@ApiResponse({ status: 500, description: 'Internal server error' })
	async remove(@Param('id') id: string) {
		try {
			const classExists = await this.classesService.findOne(id);
			if (!classExists) {
				throw new HttpException('Class not found', HttpStatus.NOT_FOUND);
			}
			await this.classesService.remove(id);
			return { message: 'Class has been deleted' };
		} catch (error) {
			throw new HttpException(
				error.message || 'Failed to delete class',
				error.status || HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}

	@Get(':id/schedules')
	@ApiOperation({ summary: 'Get schedules for a class', description: 'Retrieves all schedules for a specific class' })
	@ApiParam({ name: 'id', description: 'The UUID of the class' })
	@ApiResponse({ status: 200, description: 'Schedules retrieved successfully', type: [Schedule] })
	@ApiResponse({ status: 404, description: 'Class not found' })
	@ApiResponse({ status: 500, description: 'Internal server error' })
	async findSchedulesByClass(@Param('id') id: string) {
		try {
			return await this.classesService.findSchedulesByClass(id);
		} catch (error) {
			throw new HttpException(
				error.message || 'Failed to fetch schedules',
				error.status || HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}

	@Post('schedules')
	@Roles(Role.ADMIN, Role.TRAINER)
	@ApiOperation({ summary: 'Create a schedule', description: 'Creates a new schedule for a class (Admin, Trainer)' })
	@ApiResponse({ status: 201, description: 'Schedule created successfully', type: Schedule })
	@ApiResponse({ status: 400, description: 'Bad request - invalid data' })
	@ApiResponse({ status: 401, description: 'Unauthorized' })
	@ApiResponse({ status: 403, description: 'Forbidden - requires admin or trainer role' })
	@ApiResponse({ status: 404, description: 'Class not found' })
	async addSchedule(@Body() createScheduleDto: CreateScheduleDto, @Request() req) {
		try {
			if (req.user.role === Role.TRAINER) {
				const isAssigned = await this.classesService.isTrainerAssignedToClass(req.user.sub, createScheduleDto.classId);
				if (!isAssigned) {
					throw new HttpException('Trainer not assigned to this class', HttpStatus.FORBIDDEN);
				}
			}
			return await this.classesService.addSchedule(createScheduleDto);
		} catch (error) {
			throw new HttpException(
				error.message || 'Failed to create schedule',
				error.status || HttpStatus.BAD_REQUEST,
			);
		}
	}

	@Get('schedules/:id')
	@ApiOperation({ summary: 'Get a schedule by ID', description: 'Retrieves details for a specific schedule' })
	@ApiParam({ name: 'id', description: 'The UUID of the schedule' })
	@ApiResponse({ status: 200, description: 'Schedule found', type: Schedule })
	@ApiResponse({ status: 404, description: 'Schedule not found' })
	@ApiResponse({ status: 500, description: 'Internal server error' })
	async findSchedule(@Param('id') id: string) {
		try {
			return await this.classesService.findSchedule(id);
		} catch (error) {
			throw new HttpException(
				error.message || 'Failed to fetch schedule',
				error.status || HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}

	@Put('schedules/:id')
	@Roles(Role.ADMIN, Role.TRAINER)
	@ApiOperation({ summary: 'Update a schedule', description: 'Updates a schedule with the provided data (Admin, Trainer)' })
	@ApiParam({ name: 'id', description: 'The UUID of the schedule' })
	@ApiResponse({ status: 200, description: 'Schedule updated successfully', type: Schedule })
	@ApiResponse({ status: 400, description: 'Bad request - invalid data' })
	@ApiResponse({ status: 401, description: 'Unauthorized' })
	@ApiResponse({ status: 403, description: 'Forbidden - requires admin or trainer role' })
	@ApiResponse({ status: 404, description: 'Schedule not found' })
	async updateSchedule(@Param('id') id: string, @Body() updateScheduleDto: UpdateScheduleDto, @Request() req) {
		try {
			if (req.user.role === Role.TRAINER) {
				const isAssigned = await this.classesService.isTrainerAssignedToClass(req.user.sub, id);
				if (!isAssigned) {
					throw new HttpException('Trainer not assigned to this class', HttpStatus.FORBIDDEN);
				}
			}

			return await this.classesService.updateSchedule(id, updateScheduleDto);
		} catch (error) {
			throw new HttpException(
				error.message || 'Failed to update schedule',
				error.status || HttpStatus.BAD_REQUEST,
			);
		}
	}

	@Delete('schedules/:id')
	@Roles(Role.ADMIN, Role.TRAINER)
	@ApiOperation({ summary: 'Delete a schedule', description: 'Removes a schedule (Admin or Trainer)' })
	@ApiParam({ name: 'id', description: 'The UUID of the schedule' })
	@ApiResponse({ status: 200, description: 'Schedule deleted successfully' })
	@ApiResponse({ status: 401, description: 'Unauthorized' })
	@ApiResponse({ status: 403, description: 'Forbidden - requires admin or trainer role' })
	@ApiResponse({ status: 404, description: 'Schedule not found' })
	@ApiResponse({ status: 500, description: 'Internal server error' })
	async removeSchedule(@Param('id') id: string, @Request() req) {
		try {
			if (req.user.role === Role.TRAINER) {
				const isAssigned = await this.classesService.isTrainerAssignedToClass(req.user.sub, id);
				if (!isAssigned) {
					throw new HttpException('Trainer not assigned to this class', HttpStatus.FORBIDDEN);
				}
			}

			await this.classesService.removeSchedule(id);
			return { message: 'Schedule has been deleted' };
		} catch (error) {
			throw new HttpException(
				error.message || 'Failed to delete schedule',
				error.status || HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}
}