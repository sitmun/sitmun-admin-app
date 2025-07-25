# SITMUN Administration Application
![Build Status](https://github.com/sitmun/sitmun-admin-app/workflows/CI/badge.svg)
[![Quality Gate](https://sonarcloud.io/api/project_badges/measure?project=org.sitmun%3Asitmun-admin-app&metric=alert_status)](https://sonarcloud.io/dashboard?id=org.sitmun%3Asitmun-admin-app)

The SITMUN Administration Application is the official web-based frontend for managing the SITMUN geospatial application platform. Built with TypeScript and Angular, it provides a comprehensive user interface for the [SITMUN Backend Core](https://github.com/sitmun/sitmun-backend-core) REST API.

## System Overview

This application is part of the SITMUN software system, designed for geospatial application management and user authorization. Key features include:

- User and role management
- Application configuration
- Territory management
- Service and layer configuration
- Background layer management
- Task management and configuration
- Connection management
- Comprehensive security controls

The application communicates with the SITMUN Backend Core, which provides:

- REST API endpoints for all management operations
- JWT-based authentication
- Role-based access control
- Application privacy controls
- Public and private application management

## Build Configuration

**Available Environments:**

- Default (`src/environments/environment.ts`): Development environment with local backend
  - `apiBaseURL`: http://localhost:8080
  - `logLevel`: Debug
  - `production`: false

- Development (`src/environments/environment.development.ts`): Development with SITMUN Application Stack
  - `apiBaseURL`: http://localhost:9000/backend
  - `logLevel`: Debug
  - `production`: false

- Local Test (`src/environments/environment.localtest.ts`): Local testing environment
  - `apiBaseURL`: http://localhost:8080
  - `logLevel`: Info
  - `production`: false

- Test Deployment (`src/environments/environment.testdeployment.ts`): Heroku test deployment
  - `apiBaseURL`: https://sitmun-backend-core.herokuapp.com
  - `logLevel`: Info
  - `production`: false

- Production (`src/environments/environment.prod.ts`): Production environment
  - `apiBaseURL`: http://localhost:8080 (needs to be configured for actual production URL)
  - `logLevel`: Error
  - `production`: true

**Environment Variables:**

- `production`: Specifies if the environment is a production or a development environment
- `apiBaseURL`: Specifies the base URL for the SITMUN Backend used by the application
- `logLevel`: Controls the application logging level (Debug, Info, Error)

To build for a specific environment:

```bash
# Development with Application Stack
npm run build -- --configuration=development

# Local testing
npm run build -- --configuration=localtest

# Test deployment
npm run build -- --configuration=testdeployment

# Production
npm run build -- --configuration=production
```

## Development Setup

### Prerequisites

- Node.js (check package.json for compatible version)
- npm (Node Package Manager)
- Access to a [SITMUN Backend Core](https://github.com/sitmun/sitmun-backend-core) instance (running on Java 17 with Spring Boot 3.1.0)

### Building the Application

1. Install dependencies:
```bash
npm ci
```

2. Build the application:
```bash
npm run build -- --configuration=development --baseHref=/
```

The build output will be available in the `dist/admin-app` directory.

### Running Tests

- Run unit tests:
```bash
npm run test
```

- Run end-to-end tests:

```bash
npm run e2e
```

### Development Server

To start the development server:

```bash
npm start
```

The application will be accessible at `http://localhost:4200` by default. Make sure you have a SITMUN Backend Core instance running (default: `http://localhost:8080`).

### Additional Scripts

- `npm run lint`: Run linting checks
- `npm run test:coverage`: Run tests with coverage report
- `npm run build:prod`: Build for production

For more available scripts, check the `scripts` section in `package.json`.

## API Integration

This application integrates with the SITMUN Backend Core REST API. Key endpoints used include:

- Authentication: `/api/auth/login`, `/api/auth/logout`
- Configuration: `/api/config/client/application`
- Health: `/api/dashboard/health`

For full API documentation, refer to the [Backend Swagger UI](http://localhost:8080/swagger-ui/index.html) when running a local backend instance.

## Security

The application implements:

- JWT-based authentication
- Role-based access control
- Support for public and private applications
- Territory-based access restrictions

## Contributing

Contributions are welcome. Please open issues or pull requests in the appropriate repository:

- Frontend issues: [sitmun-admin-app](https://github.com/sitmun/sitmun-admin-app/issues)
- Backend issues: [sitmun-backend-core](https://github.com/sitmun/sitmun-backend-core/issues)
