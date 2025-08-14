# SITMUN Administration Application

![Build Status](https://github.com/sitmun/sitmun-admin-app/workflows/CI/badge.svg)
[![Quality Gate](https://sonarcloud.io/api/project_badges/measure?project=org.sitmun%3Asitmun-admin-app&metric=alert_status)](https://sonarcloud.io/dashboard?id=org.sitmun%3Asitmun-admin-app)
[![License: EUPL v1.2](https://img.shields.io/badge/License-EUPL%20v1.2-blue.svg)](LICENSE)

The **SITMUN Administration Application** is the official web-based frontend for managing the SITMUN geospatial application platform. Built with TypeScript and Angular 16, it provides a comprehensive administrative interface for the [SITMUN Backend Core](https://github.com/sitmun/sitmun-backend-core) REST API.

## Table of Contents

- [About SITMUN](#about-sitmun)
- [Features](#features)
- [Quick Start](#quick-start)
- [Installation](#installation)
- [Configuration](#configuration)
- [Development](#development)
- [Testing](#testing)
- [Deployment](#deployment)
- [API Integration](#api-integration)
- [Security](#security)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [Support](#support)
- [License](#license)

## About SITMUN

SITMUN is a comprehensive geospatial information management system designed for organizations that need to manage territorial information, geographical services, and spatial applications. The Administration Application provides the control panel for:

- **User and Role Management**: Complete user lifecycle and permission management
- **Application Configuration**: Setup and configuration of geospatial applications
- **Territory Management**: Administrative boundary and territorial data management
- **Service Integration**: WMS, WFS, and other geospatial service configuration
- **Layer Management**: Cartographic layer setup and background layer configuration
- **Task Management**: Workflow and task configuration for spatial operations
- **Connection Management**: Database and service connection administration

This frontend integrates seamlessly with the [SITMUN Backend Core](https://github.com/sitmun/sitmun-backend-core), providing a modern, responsive interface for administrative operations.

## Features

### Core Administrative Features

- 🔐 **Secure Authentication**: JWT-based authentication with role-based access control
- 👥 **User Management**: Complete user lifecycle, roles, and permissions
- 🗺️ **Application Management**: Geospatial application configuration and deployment
- 🌍 **Territory Administration**: Territorial boundaries and geographic area management
- 🔌 **Service Integration**: WMS, WFS, JDBC, and custom service connections
- 📊 **Layer Management**: Cartographic layers and background configuration
- ⚙️ **Task Configuration**: Workflow setup for spatial operations
- 🔍 **Advanced Search**: Global search across all administrative entities

### Technical Features

- 📱 **Responsive Design**: Mobile-first approach with Angular Material
- 🌐 **Internationalization**: Support for multiple languages (CA, ES, EN, FR, OC)
- 🎨 **Modern UI/UX**: Clean, intuitive interface following Material Design
- 🚀 **Performance Optimized**: Lazy loading, efficient data grids, and optimized builds
- 🔧 **Developer Tools**: Comprehensive development and debugging tools
- 📈 **Monitoring**: Integration with SonarCloud for code quality and coverage

## Quick Start

### Prerequisites

- **Node.js**: Version 16.x or higher ([Download](https://nodejs.org/))
- **npm**: Version 8.x or higher (comes with Node.js)
- **SITMUN Backend Core**: Running instance ([Setup Guide](https://github.com/sitmun/sitmun-backend-core))

### Quick Setup

```bash
# Clone the repository
git clone https://github.com/sitmun/sitmun-admin-app.git
cd sitmun-admin-app

# Install dependencies
npm ci

# Start development server
npm start

# Open browser to http://localhost:4200
```

The application will connect to a local backend at `http://localhost:8080` by default.

## Installation

### Development Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/sitmun/sitmun-admin-app.git
   cd sitmun-admin-app
   ```

2. **Install Dependencies**
   ```bash
   # Install all dependencies (recommended for CI/CD)
   npm ci
   
   # Or install with package-lock.json update
   npm install
   ```

3. **Verify Installation**
   ```bash
   # Check Angular CLI version
   npx ng version
   
   # Run linting
   npm run lint
   
   # Run tests
   npm test
   ```

### Production Installation

```bash
# Install production dependencies only
npm ci --only=production

# Build for production
npm run build -- --configuration=production

# Serve built files (example with serve)
npx serve -s dist/admin-app -l 4200
```

## Configuration

### Environment Configuration

The application supports multiple environment configurations:

| Environment         | File                            | API Base URL                                | Log Level | Production |
|---------------------|---------------------------------|---------------------------------------------|-----------|------------|
| **Default**         | `environment.ts`                | `http://localhost:8080`                     | Debug     | false      |
| **Development**     | `environment.development.ts`    | `http://localhost:9000/backend`             | Debug     | false      |
| **Local Test**      | `environment.localtest.ts`      | `http://localhost:8080`                     | Info      | false      |
| **Test Deployment** | `environment.testdeployment.ts` | `https://sitmun-backend-core.herokuapp.com` | Info      | false      |
| **Production**      | `environment.prod.ts`           | `http://localhost:8080`                     | Error     | true       |

### Environment Variables

Configure the following variables in your environment files:

```typescript
export const environment = {
  production: boolean,           // Production mode flag
  apiBaseURL: string,           // Backend API base URL
  logLevel: LogLevel,           // Application log level (Debug, Info, Error)
};
```

### Build Configuration

Build for specific environments:

```bash
# Development with Application Stack
npm run build -- --configuration=development

# Local testing
npm run build -- --configuration=localtest

# Test deployment
npm run build -- --configuration=testdeployment

# Production build
npm run build -- --configuration=production

# Production build with custom base href
npm run build -- --configuration=production --baseHref=/admin/
```

### Application Configuration

Key configuration files:

- **`src/config.ts`**: Application-specific settings (task types, languages, etc.)
- **`angular.json`**: Angular workspace configuration
- **`tsconfig.json`**: TypeScript compiler configuration
- **`jest.config.ts`**: Testing framework configuration

## Development

### Development Server

```bash
# Start development server
npm start

# Start with specific configuration
npm run build -- --configuration=development
ng serve --configuration=development

# Start with custom port
ng serve --port 4300

# Start with open browser
ng serve --open
```

### Code Generation

```bash
# Generate new component
ng generate component components/my-component

# Generate new service
ng generate service services/my-service

# Generate new module
ng generate module modules/my-module --routing
```

### Code Quality

```bash
# Run linting
npm run lint

# Fix linting issues automatically
npm run lint -- --fix

# Run SonarQube analysis
npm run sonar
```

### Development Workflow

1. **Feature Development**

   ```bash
   # Create feature branch
   git checkout -b feature/my-feature
   
   # Make changes and test
   npm test
   npm run lint
   
   # Commit with conventional commits
   git commit -m "feat(component): add new user management feature"
   ```

2. **Code Review**

  - Ensure all tests pass
  - Verify linting passes
  - Check SonarCloud quality gate
  - Review security implications

3. **Integration**

  - Test with backend integration
  - Verify all environments work
  - Update documentation as needed

## Testing

### Unit Testing

```bash
# Run unit tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage (Jest built-in)
npm test -- --coverage

# Run specific test file
npm test -- --testNamePattern="UserComponent"
```

### End-to-End Testing

```bash
# E2E testing is available via conditional script for CI/CD
# Check build-scripts/conditional-e2e.sh for implementation details
./build-scripts/conditional-e2e.sh
```

**Note**: E2E testing is currently implemented as a conditional script that runs only when the test deployment backend is available.

### Testing Strategy

- **Unit Tests**: Component logic, services, and utilities (Jest)
- **Integration Tests**: Component-service integration (Jest)
- **E2E Tests**: Conditional testing script for CI/CD environments
- **Coverage**: Jest built-in coverage reporting

## Deployment

### Docker Deployment

```dockerfile
# Multi-stage build
FROM node:16-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build -- --configuration=production

FROM nginx:alpine
COPY --from=builder /app/dist/admin-app /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Static Hosting

```bash
# Build for production
npm run build -- --configuration=production

# Deploy to static hosting (example: netlify)
npx netlify deploy --dir=dist/admin-app --prod

# Deploy to GitHub Pages
npx angular-cli-ghpages --dir=dist/admin-app
```

### Environment-Specific Deployment

```bash
# Deploy to development
npm run build -- --configuration=development
rsync -avz dist/admin-app/ user@dev-server:/var/www/sitmun-admin/

# Deploy to production
npm run build -- --configuration=production
rsync -avz dist/admin-app/ user@prod-server:/var/www/sitmun-admin/
```

## API Integration

### Backend Integration

The application integrates with the [SITMUN Backend Core](https://github.com/sitmun/sitmun-backend-core) REST API:

#### Authentication Endpoints

```typescript
// Login
POST / api / authenticate
{
  "username"
:
  "admin",
    "password"
:
  "password"
}

// Get current user account
GET / api / account
Authorization: Bearer < jwt - token >

// Logout
POST / api / logout
```

#### Core API Endpoints

```typescript
// Applications
GET / api / applications
POST / api / applications
PUT / api / applications / {id}
DELETE / api / applications / {id}

// Users and Roles
GET / api / users
GET / api / roles
POST / api / users

// Territories
GET / api / territories
POST / api / territories

// Services and Connections
GET / api / services
GET / api / connections

// Health Check
GET / api / dashboard / health
```

#### API Client Configuration

```typescript
// HTTP Interceptor for authentication
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authService.getToken();
    if (token) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }
    return next.handle(req);
  }
}
```

### Error Handling

```typescript
// Global error handling
@Injectable()
export class ErrorHandlerService {
  handleError(error: HttpErrorResponse): void {
    if (error.status === 401) {
      this.authService.logout();
      this.router.navigate(['/login']);
    } else if (error.status >= 500) {
      this.notificationService.showError('Server error occurred');
    }
  }
}
```

## Security

### Authentication and Authorization

- **JWT Tokens**: Secure token-based authentication
- **Role-Based Access Control**: Fine-grained permissions
- **Route Guards**: Protected routes based on user roles
- **HTTP Interceptors**: Automatic token handling

### Security Features

```typescript
// Route protection
{
  path: 'admin',
    component
:
  AdminComponent,
    canActivate
:
  [AuthGuard],
    data
:
  {
    roles: ['ADMIN']
  }
}

// Permission checking
@Directive({
  selector: '[hasPermission]'
})
export class HasPermissionDirective {
  @Input() hasPermission: string;

  constructor(
    private authService: AuthService,
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef
  ) {
  }

  ngOnInit() {
    if (this.authService.hasPermission(this.hasPermission)) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    }
  }
}
```

### Security Best Practices

- **Content Security Policy**: Strict CSP headers
- **HTTPS Only**: Force HTTPS in production
- **Token Expiration**: Automatic token refresh
- **Input Validation**: Client-side validation with server verification
- **XSS Protection**: Angular's built-in sanitization

## Project Structure

```
src/
├── app/
│   ├── components/           # Feature components
│   │   ├── application/      # Application management
│   │   ├── user/             # User management
│   │   ├── territory/        # Territory management
│   │   ├── service/          # Service configuration
│   │   ├── layers/           # Layer management
│   │   ├── shared/           # Shared components
│   │   └── ...
│   ├── core/                 # Core functionality
│   │   ├── auth/             # Authentication services
│   │   ├── guards/           # Route guards
│   │   ├── interceptors/     # HTTP interceptors
│   │   └── hal/              # HAL REST client
│   ├── domain/               # Domain models and services
│   │   ├── application/      # Application domain
│   │   ├── user/             # User domain
│   │   ├── territory/        # Territory domain
│   │   └── ...
│   ├── services/             # Application services
│   └── utils/                # Utility functions
├── assets/                   # Static assets
│   ├── i18n/                 # Translation files
│   └── img/                  # Images and icons
├── environments/             # Environment configurations
└── docs/                     # Documentation
```

### Key Architecture Decisions

- **Domain-Driven Design**: Clear separation of concerns
- **HAL REST Client**: Hypermedia-driven API client
- **Angular Material**: Consistent UI components
- **Reactive Forms**: Type-safe form handling
- **RxJS**: Reactive programming patterns

## Contributing

### Development Guidelines

1. **Fork the repository** and create a feature branch
2. **Follow Angular style guide** and project conventions
3. **Write tests** for new functionality
4. **Update documentation** as needed
5. **Ensure quality checks pass**:
   ```bash
   npm run lint
   npm test
   npm run build -- --configuration=production
   ```
6. **Submit a pull request** with a clear description

### Conventional Commits

We use [Conventional Commits](https://conventionalcommits.org/) for commit messages:

```bash
# Examples
git commit -m "feat(user): add user profile management"
git commit -m "fix(auth): resolve token refresh issue"
git commit -m "docs(readme): update installation instructions"
git commit -m "test(components): add unit tests for user component"
git commit -m "style(formatting): apply prettier formatting"
```

**Types:**

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks
- `perf`: Performance improvements
- `ci`: CI/CD changes
- `build`: Build system changes

### Code Review Process

1. **Automated Checks**: All PRs must pass CI/CD pipeline
2. **Code Review**: At least one maintainer review required
3. **Quality Gate**: SonarCloud quality gate must pass
4. **Testing**: All tests must pass with adequate coverage
5. **Documentation**: Update docs for new features

## Support

### Getting Help

- **Documentation**: Check the [docs](docs) directory
- **Issues**: [GitHub Issues](https://github.com/sitmun/sitmun-admin-app/issues)
- **Backend Issues**: [Backend Core Issues](https://github.com/sitmun/sitmun-backend-core/issues)
- **Discussions**: [GitHub Discussions](https://github.com/sitmun/sitmun-admin-app/discussions)

### Reporting Issues

When reporting issues, please include:

1. **Environment**: OS, Node.js version, browser
2. **Steps to reproduce**: Clear step-by-step instructions
3. **Expected behavior**: What should happen
4. **Actual behavior**: What actually happens
5. **Screenshots**: If applicable
6. **Console logs**: Browser console errors

## License

This project is licensed under the **European Union Public Licence V. 1.2** (EUPL-1.2).

The EUPL is a copyleft open-source license compatible with major open-source licenses including GPL, AGPL, MPL, and others. See the [LICENSE](LICENSE) file for the full license text.

### License Compatibility

The EUPL v1.2 is compatible with:

- GNU General Public License (GPL) v2, v3
- GNU Affero General Public License (AGPL) v3
- Mozilla Public License (MPL) v2
- Eclipse Public License (EPL) v1.0
- And many others

---

## About SITMUN

SITMUN is an open-source platform for territorial information management, designed to help organizations manage geographical data, services, and applications effectively.

**Related Projects:**

- [SITMUN Backend Core](https://github.com/sitmun/sitmun-backend-core) - REST API and business logic
- [SITMUN Proxy Middleware](https://github.com/sitmun/sitmun-proxy-middleware) - Proxy and security middleware
- [SITMUN Map Viewer](https://github.com/sitmun/sitmun-map-viewer) - Map visualization frontend

**Technology Stack:**

- Frontend: Angular 16, TypeScript, Angular Material
- Backend: Spring Boot 3, Java 17, PostgreSQL/Oracle
- Infrastructure: Docker, GitHub Actions, SonarCloud

For more information, visit the [SITMUN organization](https://github.com/sitmun) on GitHub.
