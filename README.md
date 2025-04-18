# Sports Program Management

## Description

This project provides a backend API for a sports complex to manage its various sports classes. The system supports multiple sports (baseball, basketball, football, etc.), each with their own set of classes that occur regularly throughout the week.
Key features include:

- User registration and authentication with role-based access
- Sports and classes management
- Class scheduling
- User enrollment in classes
- Admin dashboard to manage classes and view enrollments

## Technologies

- Node.js
- NestJS Framework with TypeScript
- Express
- MySQL
- Sequelize ORM
- JWT Authentication
- Swagger

## Prerequisites

- Node.js (v14 or higher)
- MySQL (v5.7 or higher)

## Project setup

1. Clone the repository:
```bash
git clone https://github.com/markorasonja/sports-program-management.git
cd sports-program-management
```

2. Install
```bash
$ npm install
```

3. Configure environment variables: Create a .env file in the project root with the following variables:

```
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=mysql_password
DB_NAME=sports_management
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=1h
```

4. Create the database:
```
mysql -u root -p -e "CREATE DATABASE sports_management;"
```

5. Create the tables by starting the application.
```
npm run start
```

6. Initialize the database data:
```
mysql -u root -p sports_management < src/database/seeders/init.sql
```

This will create:
- 3 users (admin, trainer, student) with the password "Password123!"
- 3 sports (Football, Tennis, Basketball)
- Classes for each sport


## Running the Application

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

By default, the application will be available at http://localhost:3000


## API Documentation
The API is documented using Swagger UI, which can be accessed at:
```
http://localhost:3000/api/docs
```

From here, you can:
- See all available endpoints
- Test API endpoints directly
- View request/response schemas
- Authorize with JWT tokens


### User Roles and Permissions
1. Admin
- Can create/update/delete all resources
- Can manage users and change their roles
- Can approve/reject applications

2. Trainer
- Can view classes and their schedules
- Can create/update/delete schedules for classes they teach
- Can apply to become a trainer for a class
- Can view applications for classes they teach

3. Student
- Can view available classes and schedules
- Can apply to enroll in classes
- Can view their own applications


## Run tests

```bash
# unit tests
$ npm run test
```


## License
[MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
