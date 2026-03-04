# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.2.4] - 2026-03-04

### Added

- Detailed validation error messages in notifications: show field-level errors from RFC 9457 `errors` array, i18n for `messageCode` (e.g. `validation.NotBlank`, `validation.BoundingBox`), multi-line display in notification component.
- Tree view mode handling with icons and labels for different view modes in tree nodes component.
- Task properties regression tests to prevent model drift.

### Changed

- Node.js requirement updated to `>=20.19.0` (engines).
- Angular framework upgraded to version 19 (^19.2.x) with latest features and performance improvements.
- Tree node type unification: consolidated `treenode.folder.type` and `treenode.leaf.type` into unified `treenode.node.type` for consistent node handling across the application.
- Task properties made opaque to improve encapsulation and type safety.

### Fixed

- Save failure: show a single error notification (interceptor only) and skip post-save logic; log error in component catch instead of calling ErrorHandlerService to avoid duplicate snackbar.
- Development API URL set to `http://localhost:9000/backend` so `ng serve` uses the Nginx proxy path and CORS works correctly.
- Tree duplication: await recursive node updates so child nodes complete before navigation; strip `_links` on duplicated nodes for clean create path (fixes #359).
- Tree node type handling and mapping dialog state stabilization.
- Aranés flag SVG metadata removed to fix language selector label display on login screen (fixes #360).

## [1.2.3] - 2026-02-26

### Added

- More Information task support for API/SQL/URL scopes in task configuration.
- API key input support for More Information API integrations.
- Additional form hints and i18n entries for URL and SQL parameterized More Information tasks.
- Test coverage for More Information task workflows.

### Changed

- More Information model/field mapping updated to use `type` semantics instead of previous `scope` naming.
- More Information form workflow and field behavior refined for cleaner payloads and easier cartography selection.

### Removed

- Redundant More Information parameter fields (`key`, `name`, `type`) from task configuration values.

## [1.2.2] - 2026-02-16

### Added

- System configuration menu for admin users.
- Tree type constraints enforcement for node type selection and validation.

## [1.2.1] - 2026-02-06

### Added

- OIDC authentication support with dynamically configured providers ([c4cfdb5](https://github.com/sitmun/sitmun-admin-app/commit/c4cfdb5ee))
- Callback component to handle backend redirection and JWT storage ([c4cfdb5](https://github.com/sitmun/sitmun-admin-app/commit/c4cfdb5ee))
- Cookie-based JWT transport using ngx-cookie-service for future HttpOnly cookie support ([c4cfdb5](https://github.com/sitmun/sitmun-admin-app/commit/c4cfdb5ee))
- OIDC provider buttons dynamically rendered below separator in login form ([c4cfdb5](https://github.com/sitmun/sitmun-admin-app/commit/c4cfdb5ee))
- Translation strings for OIDC authentication flows ([c4cfdb5](https://github.com/sitmun/sitmun-admin-app/commit/c4cfdb5ee))
- Callback component tests ([4d30914](https://github.com/sitmun/sitmun-admin-app/commit/4d309140))

### Changed

- Refactored auth constants for better organization ([dfd0ff3](https://github.com/sitmun/sitmun-admin-app/commit/dfd0ff3b))
- Updated to Material spinner component ([dfd0ff3](https://github.com/sitmun/sitmun-admin-app/commit/dfd0ff3b))
- Enhanced authentication test coverage ([dfd0ff3](https://github.com/sitmun/sitmun-admin-app/commit/dfd0ff3b))

## [1.2.0] - 2026-01-27

### Added

- New tree node view mode
- Help tooltips in node mapping and task edit attributes forms

### Fixed

- Numeric layer names handling in WMS capabilities processing
- Translation infrastructure with defensive programming and null checks
- Role form save payload to include form values via createObject
- Field rename from spatialSelectionConnectionId to spatialSelectionServiceId in layers form

## [1.1.1] - 2025-08-28

### Added

- Application header parameter configuration with customizable left and right sections
- Header display controls for SITMUN logo, application switcher, home menu, language selector, profile and logout buttons
- Enhanced task selection functionality on tree nodes with improved validation
- Application privacy controls through `appPrivate` property configuration

### Changed

- Modernized territory form component with BaseFormComponent pattern for consistency
- Enhanced tree node task selection with better validation and error messaging
- Improved warnings panel component with expandable interface and badge notifications

### Fixed

- Angular compiler strict template compliance issues across multiple components
- Background maps filtering in layers-permits grid to prevent display conflicts
- Error handling with localized messages for initialization and service capabilities
- Fallback message translation handling for better internationalization
- Application form initialization to ensure `isUnavailable` property is properly set
- Route-driven authentication layout with simplified auth flow
- Core/HAL module with dropped Node polyfills and modernized RxJS error handling

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

[Unreleased]: https://github.com/sitmun/sitmun-admin-app/compare/sitmun-admin-app/1.2.4...HEAD
[1.2.4]: https://github.com/sitmun/sitmun-admin-app/compare/sitmun-admin-app/1.2.3...sitmun-admin-app/1.2.4
[1.2.3]: https://github.com/sitmun/sitmun-admin-app/compare/sitmun-admin-app/1.2.2...sitmun-admin-app/1.2.3
[1.2.2]: https://github.com/sitmun/sitmun-admin-app/compare/sitmun-admin-app/1.2.1...sitmun-admin-app/1.2.2
[1.2.0]: https://github.com/sitmun/sitmun-admin-app/compare/sitmun-admin-app/1.1.1...sitmun-admin-app/1.2.0
[1.1.1]: https://github.com/sitmun/sitmun-admin-app/compare/sitmun-admin-app/1.1.0...sitmun-admin-app/1.1.1
[1.1.0]: https://github.com/sitmun/sitmun-admin-app/compare/sitmun-admin-app/1.0.0...sitmun-admin-app/1.1.0
[1.0.0]: https://github.com/sitmun/sitmun-admin-app/releases/tag/sitmun-admin-app/1.0.0
