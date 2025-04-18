import {
	Controller, Get, Post, Put, Delete,
	Body, Param, UseGuards, Request,
	HttpException, HttpStatus, Query
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiQuery, ApiBody } from '@nestjs/swagger';
import { ApplicationsService } from './applications.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationStatusDto } from './dto/update-application-status.dto';
import { RolesGuard } from '../auth/roles.guard';
import { ApplicationType } from '../common/enums/application-type.enum';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { ClassesService } from '../classes/classes.service';
import { Application } from './entities/application.entity';
import { Class } from '../classes/entities/class.entity';

@ApiTags('applications')
@ApiBearerAuth()
@Controller('applications')
@UseGuards(RolesGuard)
export class ApplicationsController {
	constructor(
		private applicationsService: ApplicationsService,
		private classesService: ClassesService,
	) { }

	@Post()
	@Roles(Role.STUDENT)
	@ApiOperation({ summary: 'Create student application', description: 'Creates a new application for a student to enroll in a class (Student only)' })
	@ApiBody({ type: CreateApplicationDto })
	@ApiResponse({ status: 201, description: 'Application created successfully', type: Application })
	@ApiResponse({ status: 400, description: 'Bad request - invalid data or already applied' })
	@ApiResponse({ status: 401, description: 'Unauthorized' })
	@ApiResponse({ status: 403, description: 'Forbidden - requires student role' })
	@ApiResponse({ status: 404, description: 'Class not found' })
	async create(
		@Body() createApplicationDto: CreateApplicationDto,
		@Request() req
	) {
		try {
			return await this.applicationsService.create(req.user.sub, createApplicationDto);
		} catch (error) {
			throw new HttpException(
				error.message || 'Failed to create application',
				error.status || HttpStatus.BAD_REQUEST,
			);
		}
	}

	@Get()
	@Roles(Role.ADMIN)
	@ApiOperation({ summary: 'Get all applications', description: 'Retrieves all applications or applications (Admin only)' })
	@ApiResponse({ status: 200, description: 'List of applications', type: [Application] })
	@ApiResponse({ status: 401, description: 'Unauthorized' })
	@ApiResponse({ status: 403, description: 'Forbidden - requires admin role' })
	@ApiResponse({ status: 500, description: 'Internal server error' })
	async findAll() {
		try {
			return await this.applicationsService.findAll();
		} catch (error) {
			throw new HttpException(
				error.message || 'Failed to fetch applications',
				error.status || HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}

	@Get('class/:classId')
	@Roles(Role.ADMIN, Role.TRAINER)
	@ApiOperation({ summary: 'Get applications for a class', description: 'Retrieves all applications for a specific class (Admin or Trainer only)' })
	@ApiParam({ name: 'classId', description: 'The UUID of the class' })
	@ApiResponse({ status: 200, description: 'List of applications for the class', type: [Application] })
	@ApiResponse({ status: 401, description: 'Unauthorized' })
	@ApiResponse({ status: 403, description: 'Forbidden - requires admin or trainer role' })
	@ApiResponse({ status: 404, description: 'Class not found' })
	@ApiResponse({ status: 500, description: 'Internal server error' })
	async findByClass(@Param('classId') classId: string, @Request() req) {
		try {
			const classEntity = await this.classesService.findOne(classId);
			if (!classEntity) {
				throw new HttpException('Class not found', HttpStatus.NOT_FOUND);
			}

			if (req.user.role === Role.TRAINER && classEntity.trainerId !== req.user.sub) {
				throw new HttpException(
					'You can only view applications for classes you are assigned to',
					HttpStatus.FORBIDDEN,
				);
			}
			return await this.applicationsService.findAllByClass(classId);
		} catch (error) {
			throw new HttpException(
				error.message || 'Failed to fetch applications',
				error.status || HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}

	@Get('my-applications')
	@ApiOperation({ summary: 'Get my applications', description: 'Retrieves all applications for the authenticated user' })
	@ApiResponse({ status: 200, description: 'User\'s applications retrieved successfully', type: [Application] })
	@ApiResponse({ status: 401, description: 'Unauthorized' })
	@ApiResponse({ status: 500, description: 'Internal server error' })
	async findMyApplications(@Request() req) {
		try {
			return await this.applicationsService.findAllByUser(req.user.sub);
		} catch (error) {
			throw new HttpException(
				error.message || 'Failed to fetch applications',
				error.status || HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}

	@Get(':id')
	@ApiOperation({ summary: 'Get application by ID', description: 'Retrieves a specific application (users can only view their own applications)' })
	@ApiParam({ name: 'id', description: 'The UUID of the application' })
	@ApiResponse({ status: 200, description: 'Application retrieved successfully', type: Application })
	@ApiResponse({ status: 401, description: 'Unauthorized' })
	@ApiResponse({ status: 403, description: 'Forbidden - cannot view other users\' applications' })
	@ApiResponse({ status: 404, description: 'Application not found' })
	@ApiResponse({ status: 500, description: 'Internal server error' })
	async findOne(@Param('id') id: string, @Request() req) {
		try {
			const application = await this.applicationsService.findOne(id);
			if (!application) {
				throw new HttpException('Application not found', HttpStatus.NOT_FOUND);
			}

			if (req.user.role === Role.STUDENT && application.userId !== req.user.sub) {
				throw new HttpException(
					'You can only view your own applications',
					HttpStatus.FORBIDDEN,
				);
			} else if (req.user.role === Role.TRAINER && application.class.trainerId !== req.user.sub) {
				throw new HttpException(
					'You can only view applications for classes you are assigned to',
					HttpStatus.FORBIDDEN,
				);
			}

			return application;
		} catch (error) {
			throw new HttpException(
				error.message || 'Failed to fetch application',
				error.status || HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}

	@Put(':id/status')
	@Roles(Role.ADMIN)
	@ApiOperation({ summary: 'Update application status', description: 'Updates the status of an application (Admin)' })
	@ApiParam({ name: 'id', description: 'The UUID of the application' })
	@ApiBody({ type: UpdateApplicationStatusDto })
	@ApiResponse({ status: 200, description: 'Application status updated successfully', type: Application })
	@ApiResponse({ status: 400, description: 'Bad request - invalid status or class at capacity' })
	@ApiResponse({ status: 401, description: 'Unauthorized' })
	@ApiResponse({ status: 403, description: 'Forbidden - requires admin role' })
	@ApiResponse({ status: 404, description: 'Application not found' })
	async updateStatus(
		@Param('id') id: string,
		@Body() updateStatusDto: UpdateApplicationStatusDto,
		@Request() req
	) {
		try {
			const application = await this.applicationsService.findOne(id);
			if (!application) {
				throw new HttpException('Application not found', HttpStatus.NOT_FOUND);
			}

			return await this.applicationsService.updateStatus(id, updateStatusDto);
		} catch (error) {
			throw new HttpException(
				error.message || 'Failed to update application status',
				error.status || HttpStatus.BAD_REQUEST,
			);
		}
	}

	@Get('classes/available-for-trainers')
	@Roles(Role.ADMIN, Role.TRAINER)
	@ApiOperation({ summary: 'Get classes without trainers', description: 'Retrieves classes that have no assigned trainer (Trainer, Admin)' })
	@ApiResponse({ status: 200, description: 'List of classes without trainers', type: [Class] })
	@ApiResponse({ status: 401, description: 'Unauthorized' })
	@ApiResponse({ status: 403, description: 'Forbidden - requires trainer role' })
	@ApiResponse({ status: 500, description: 'Internal server error' })
	async getClassesWithoutTrainers() {
		try {
			return await this.classesService.findClassesWithoutTrainer();
		} catch (error) {
			throw new HttpException(
				error.message || 'Failed to fetch available classes',
				error.status || HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}

	@Post('trainer-application')
	@Roles(Role.TRAINER)
	@ApiOperation({ summary: 'Apply as trainer', description: 'Creates an application for a trainer to teach a class (Trainer)' })
	@ApiBody({ type: CreateApplicationDto })
	@ApiResponse({ status: 201, description: 'Trainer application created successfully', type: Application })
	@ApiResponse({ status: 400, description: 'Bad request - invalid data, class already has a trainer, or already applied' })
	@ApiResponse({ status: 401, description: 'Unauthorized' })
	@ApiResponse({ status: 403, description: 'Forbidden - requires trainer role' })
	@ApiResponse({ status: 404, description: 'Class not found' })
	async applyAsTrainer(
		@Body() createApplicationDto: CreateApplicationDto,
		@Request() req
	) {
		try {
			createApplicationDto.type = ApplicationType.TRAINER_ASSIGNMENT;
			return await this.applicationsService.create(req.user.sub, createApplicationDto);
		} catch (error) {
			throw new HttpException(
				error.message || 'Failed to create trainer application',
				error.status || HttpStatus.BAD_REQUEST,
			);
		}
	}

	@Delete(':id')
	@ApiOperation({ summary: 'Delete application', description: 'Deletes an application' })
	@ApiParam({ name: 'id', description: 'The UUID of the application' })
	@ApiResponse({ status: 200, description: 'Application deleted successfully' })
	@ApiResponse({ status: 400, description: 'Bad request - can only delete pending applications' })
	@ApiResponse({ status: 401, description: 'Unauthorized' })
	@ApiResponse({ status: 403, description: 'Forbidden - cannot delete other users\' applications' })
	@ApiResponse({ status: 404, description: 'Application not found' })
	@ApiResponse({ status: 500, description: 'Internal server error' })
	async remove(@Param('id') id: string, @Request() req) {
		try {
			const application = await this.applicationsService.findOne(id);
			if (!application) {
				throw new HttpException('Application not found', HttpStatus.NOT_FOUND);
			}
			if (req.user.role === Role.STUDENT && application.userId !== req.user.sub) {
				throw new HttpException(
					'You can only delete your own applications',
					HttpStatus.FORBIDDEN,
				);
			}
			await this.applicationsService.remove(id);
			return { message: 'Application has been deleted' };
		} catch (error) {
			throw new HttpException(
				error.message || 'Failed to delete application',
				error.status || HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}
}
