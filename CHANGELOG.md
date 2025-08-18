# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.1.0] - 2025-08-03

### Added

- Warnings panel to surface user validation issues from backend
- Application privacy controls with `appPrivate` property
- Feature flag system with directive, pipe, component, and service
- Task edit management components for enhanced task administration
- User info component to toolbar for better user experience
- Email field to user form with validation
- Description field to territory form and model
- Search and replace functionality to data grid
- Roles management tab to trees form
- Tree node mapping fields and namespaces for XML
- Router link renderer for improved data grid functionality
- Application dashboard field
- Creator field and maintenance information to application form
- Character counter and validation to various forms
- Comprehensive logging facilities and URI template support
- Docker support for development environment

### Changed

- Migrated multiple components to `BaseFormComponent` pattern for consistency
- Modernized territory form component with `BaseFormComponent` pattern
- Migrated from TSLint to ESLint for better code quality
- Replaced Karma with Jest testing framework
- Enhanced error handling with localized messages
- Improved database connection validation
- Standardized side menu structure and translation handling
- Migrated from frontend-core to domain module architecture for better organization
- Reorganized HAL module as part of core with functional structure
- Modernized component architecture with base component patterns
- Updated RxJS from v6.6.0 to v7.8.1 for Angular 16 compatibility

### Fixed

- Route-driven authentication layout and simplified auth flow
- Angular compiler strict template compliance issues
- Background maps filtering in layers-permits grid
- Error handling and fallback message translation
- 403 errors now properly redirect to login page
- Logout functionality issues and prevented API request loops
- TypeScript compilation errors for Angular 16 compatibility
- Deprecated AG Grid and Angular form APIs
- Empty SCSS files and restored variables.scss
- Multiple territories assignment to multiple roles
- Task form validation and UI improvements
- Layer permissions and roles components
- AG Grid autoresize functionality
- Dashboard component issues
- Login functionality restoration

### Removed

- Node polyfills from core/hal module
- Syncfusion dependencies
- Protractor testing framework
- Unused save methods from domain services
- Redundant translations and improved structure

## [1.0.0] - 2024-11-12

### Added

- Initial stable release of SITMUN Admin Application
- Comprehensive user management interface
- Territory and application administration
- Cartography and service management
- Task management system with multiple task types (basic, query, edit)
- Tree and node management
- Background layers administration
- Role-based access control interface
- Connection management for database connections
- Multilingual support (Catalan, English, Spanish, French, Occitan)
- Responsive design with modern UI components
- Form validation and error handling
- Data grid functionality with AG Grid
- Authentication and authorization system
- REST API integration with HAL+JSON
- Comprehensive test suite with Karma and Jasmine

### Changed

- Implemented proper dependency management
- Enhanced code quality and maintainability

### Fixed

- Various bug fixes and improvements from development phase

[unreleased]: https://github.com/sitmun/sitmun-admin-app/compare/sitmun-admin-app/1.1.0...HEAD

[1.1.0]: https://github.com/sitmun/sitmun-admin-app/compare/sitmun-admin-app/1.0.0...sitmun-admin-app/1.1.0

[1.0.0]: https://github.com/sitmun/sitmun-admin-app/releases/tag/sitmun-admin-app/1.0.0
