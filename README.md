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

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```


## License
[MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
