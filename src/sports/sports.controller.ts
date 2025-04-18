import {
	Controller, Get, Post, Put, Delete,
	Body, Param, UseGuards,
	HttpException, HttpStatus
} from '@nestjs/common';
import { SportsService } from './sports.service';
import { CreateSportDto } from './dto/create-sport.dto';
import { UpdateSportDto } from './dto/update-sport.dto';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { Sport } from './entities/sport.entity';

@ApiTags('sports')
@ApiBearerAuth()
@Controller('sports')
@UseGuards(RolesGuard)
@Roles(Role.ADMIN)
export class SportsController {
	constructor(private sportsService: SportsService) { }

	@Post()
	@ApiOperation({ summary: 'Create a new sport', description: 'Creates a new sport' })
	@ApiResponse({ status: 201, description: 'The sport has been successfully created', type: Sport })
	@ApiResponse({ status: 400, description: 'Bad request - invalid data or sport already exists' })
	@ApiResponse({ status: 401, description: 'Unauthorized' })
	@ApiResponse({ status: 403, description: 'Forbidden - requires admin role' })
	async create(@Body() createSportDto: CreateSportDto) {
		try {
			const sport = await this.sportsService.create(createSportDto);
			return sport;
		} catch (error) {
			throw new HttpException(
				error.message || 'Failed to create sport',
				HttpStatus.BAD_REQUEST,
			);
		}
	}

	@Get()
	@ApiOperation({ summary: 'Get all sports', description: 'Retrieves a list of all sports' })
	@ApiResponse({ status: 200, description: 'List of sports retrieved successfully', type: [Sport] })
	@ApiResponse({ status: 401, description: 'Unauthorized' })
	@ApiResponse({ status: 500, description: 'Internal server error' })
	async findAll() {
		try {
			return await this.sportsService.findAll();
		} catch (error) {
			throw new HttpException(
				error.message || 'Failed to fetch sports',
				HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}

	@Get(':id')
	@ApiOperation({ summary: 'Get a sport by ID', description: 'Retrieves information about a specific sport' })
	@ApiParam({ name: 'id', description: 'The UUID of the sport' })
	@ApiResponse({ status: 200, description: 'Sport found', type: Sport })
	@ApiResponse({ status: 404, description: 'Sport not found' })
	@ApiResponse({ status: 401, description: 'Unauthorized' })
	@ApiResponse({ status: 500, description: 'Internal server error' })
	async findOne(@Param('id') id: string) {
		try {
			return await this.sportsService.findOne(id);
		} catch (error) {
			if (error.status === HttpStatus.NOT_FOUND) {
				throw error;
			}
			throw new HttpException(
				error.message || 'Failed to fetch sport',
				HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}

	@Put(':id')
	@ApiOperation({ summary: 'Update a sport', description: 'Updates a sport with the provided data' })
	@ApiParam({ name: 'id', description: 'The UUID of the sport' })
	@ApiResponse({ status: 200, description: 'Sport updated successfully', type: Sport })
	@ApiResponse({ status: 400, description: 'Bad request - invalid data or sport name already exists' })
	@ApiResponse({ status: 401, description: 'Unauthorized' })
	@ApiResponse({ status: 403, description: 'Forbidden - requires admin role' })
	@ApiResponse({ status: 404, description: 'Sport not found' })
	async update(@Param('id') id: string, @Body() updateSportDto: UpdateSportDto) {
		try {
			return await this.sportsService.update(id, updateSportDto);
		} catch (error) {
			if (error.status === HttpStatus.NOT_FOUND) {
				throw error;
			}
			throw new HttpException(
				error.message || 'Failed to update sport',
				HttpStatus.BAD_REQUEST,
			);
		}
	}

	@Delete(':id')
	@ApiOperation({ summary: 'Delete a sport', description: 'Removes a sport' })
	@ApiParam({ name: 'id', description: 'The UUID of the sport' })
	@ApiResponse({ status: 200, description: 'Sport deleted successfully' })
	@ApiResponse({ status: 401, description: 'Unauthorized' })
	@ApiResponse({ status: 403, description: 'Forbidden - requires admin role' })
	@ApiResponse({ status: 404, description: 'Sport not found' })
	@ApiResponse({ status: 500, description: 'Internal server error' })
	async remove(@Param('id') id: string) {
		try {
			await this.sportsService.remove(id);
			return { message: 'Sport has been deleted' };
		} catch (error) {
			if (error.status === HttpStatus.NOT_FOUND) {
				throw error;
			}
			throw new HttpException(
				error.message || 'Failed to remove sport',
				HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}
}