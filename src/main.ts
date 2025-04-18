import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	// app.setGlobalPrefix('api');

	app.useGlobalPipes(
		new ValidationPipe({
			transform: true,
			whitelist: true,
			transformOptions: {
				enableImplicitConversion: true
			}
		}),
	);

	const config = new DocumentBuilder()
		.setTitle('Sports Program Management API')
		.setDescription('API for managing sports classes, schedules, trainers, and student enrollments')
		.setVersion('1.0')
		.addTag('auth', 'Authentication endpoints')
		.addTag('users', 'User management endpoints')
		.addTag('sports', 'Sports management endpoints - for admins')
		.addTag('classes', 'Classes management endpoints')
		.addTag('applications', 'Application management endpoints')
		.addBearerAuth()
		.build();

	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('api/docs', app, document);

	await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
