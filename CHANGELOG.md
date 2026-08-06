# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Fixed

- **Templates / TipTap**: Attribute mustaches (`src`/`href`/`alt`/… ) stay literal attributes; chips apply only to HTML text. Source-aware protect is idempotent, chips `else if`, and T-wrap restores chips to raw mustaches before storing `<t>` payloads.
- **Templates / TipTap**: After intentional visual edits, authored `div` blocks, bare table cells (no injected `colgroup`/`min-width`), and links without `target`/`rel` keep their shape; toolbar-created links still get `target="_blank"` and `rel="noopener noreferrer"`.
- **Templates / TipTap**: Split editor+preview workspace fills available viewport height (was fixed ~428px; preview-only already did).
- **Templates / TipTap**: HTML comments survive visual round-trip via marker nodes (TipTap drops real `<!--…-->` on parse).
- **Templates / Preview**: Navigable links in the preview pane open in a new tab (`noopener`) so the admin SPA is not replaced.
- **Templates / Sources**: Memoize `rootParameterDefaults` (stable identity across CD) and prefer live Parameters grid rows for Sources prefill + Template preview `$…` context.
- **Templates / TipTap**: Mustache `img`/`iframe` `src` shows a binding placeholder in visual mode (no relative URL load); selection toolbar inspects/edits `src`/`alt`/`title`; serialize keeps literal attributes.
- **Templates**: `replaceReferenceAliasInHtml` renames single-quoted `data-sitmun-each` as well as double-quoted.
- **Tests**: Filter expected Jest `console.error` noise (`Code list … not initialized`, `NG0304`); TipTap-split triple-mustache normalize fixture.

### Changed

- **Templates / Preview**: Preview language selector stays in the Template preview pane only; Sources Execute inherits that language (no Sources language UI).

## [1.2.8] - 2026-07-30

### Added

- **Templates**: Form tabs Details / Template / Sources with preview toggle and resizable sash; insert-from-Sources focuses Template.
- **Templates**: Bound-table **R** chip and table-only Reference rebind (orphan aliases stay visible); inline `{{…}}` code chips in the visual editor.

- **Templates** / **More Info Advanced**: TipTap HTML editor, ADMIN preview, linked-child execute-child dry-run (coords not required); typeId 16 MIA task configuration UI (runtime map render remains in the viewer).
- **Literal translations**: Admin CRUD, CSV import/export, and completion indicators.
- **Task types**: List and title-only form (`/taskType`, `/taskType/:id/taskTypeForm`) with side-menu entry (duplicate hidden); i18n strings in all five locales.
- **Languages** / **Language chrome**: `enabled`/`order` on language form/list (disabled excluded from menus/dialogs; default language cannot be disabled); toolbar/login show closed BCP-47 ISO and open API endonyms; UI language from `localStorage.lang` → `language.default` → static; guarded set-default workflow with missing-translation preview; `language.default` protected in configuration parameters.
- **Trees** / **Application trees**: `loadData` and `queryableActive` cartography toggles with admin-tree badges; application↔tree links via `/api/application-trees` with editable `order` ([sitmun-viewer-app#45](https://github.com/sitmun/sitmun-viewer-app/issues/45)).
- **Application**: Optional responsible institution, eligible PoC selector (built-in/blocked excluded), list warning indicator, and user-form impact warnings ([#316](https://github.com/sitmun/sitmun-admin-app/issues/316)).
- **Tests**: Jest coverage for WMS metadata parsing, service-form translation prefill, auth/session validation, admin guard feedback, HAL credentials, dialog/grid/URL/relation-selector regressions.

### Changed

- **Templates**: Preview does not post `appId`/`terId` (user-only coords; known APP_*/TERR_* render as bare names when unresolved); styles `.sitmun-template-error` / `.sitmun-template-known`; sash past max width closes Preview; sash past min width hides the editor (restore via left sash or toolbar).
- **Literal translations** / **Templates**: Language selectors and template preview use enabled languages only (template form refreshes languages on load); CSV import may still target/use disabled languages.
- **Templates**: `<t>` dictionary enrollment happens on backend Task save (no client ensure-after-save); TipTap nested inner HTML is the exact dictionary key.
- **Templates**: Split sash matches tree-editor resize (mat-card panes, flex width %, DOM drag outside Angular CD so TipTap does not reflow every pixel, persisted width).
- **Templates**: Preview show/hide moved into the editor toolbar (and close on the preview pane); external Editor/Split/Preview layout chips removed.
- **Templates**: Material Visual/HTML toggles, denser icon toolbar (format/table actions via `mat-icon-button` + tooltips), mat-select font/reference controls, and flatter workspace chrome (no nested Editor card).
- **Templates**: Visual/HTML/Preview sit in the main toolbar band (Preview independent of editor mode); preview pane starts closed.
- **Templates**: Format HTML and hide-preview are icon buttons; Render stays a labeled primary action.
- **Templates**: System variables (`{{#APP_NAME}}`) use amber inline chips, distinct from purple `#each` blocks and gray expression chips.
- **Templates**: Visual editor re-chips raw `{{…}}` on load/update (no longer requires HTML→Visual round-trip).
- **Templates**: Toolbar rows share a 36px control height (compact selects/inputs instead of tall outline fields).

- **Literal translations** / **Forms** / **Query tasks**: CSV import surfaces `literal_too_long` / `translation_too_long` over 4000 chars; remove unreachable character-limit warning icons; query-task save blocked when `#{param}` placeholders are undeclared.
- **Trees** / **Task types**: `visible`/`active` semantics aligned with backend; radio folder toggle limited to cartography trees; relation grids and tree-node pickers show localized `typeTitle` and request `lang`.
- **Connections**: Field hints, Tasks tab intro/quick search, and raised primary JDBC test button aligned with service/layer patterns.
- **Data grid**: `app-relation-grid` wrapper with capability flags and dirty tracking rolled out across admin form relation grids; auto discard/undo/redo when grids own pending changes; direct `app-data-grid` remains for entity lists, pickers, and the wrapper delegate.
- **Layers** / **Dialogs**: Relation-tab column widths tuned; template modals use shared `formDialogs` width (640px); picker modals hide export and size from column `minWidth`.
- **Auth** / **HAL**: Credentialed `authGuard` identity reload with admin-rights warning; coalesced `AuthExpiredInterceptor` `/api/account` probe after 401; Observable logout waits for cookie removal; HAL `Resource`/`AccountService` send `withCredentials: true`.

### Fixed

- **Templates**: TipTap preserves `data-sitmun-each` on query tables so Preview still expands rows after visual edits ([#441](https://github.com/sitmun/sitmun-admin-app/issues/441)).
- **Templates** / **i18n**: Forms and lists no longer throw `null.localeCompare` after `language.default` change; shared `compareNullableString` for sorts ([#440](https://github.com/sitmun/sitmun-admin-app/issues/440)).
- **i18n**: `BaseFormComponent` / tree-nodes / Literal translations read live `config.defaultLang` (no stale construction snapshot after Set-as-default).
- **Templates** / **i18n**: Sources copy buttons use `common.copy` (added in all locales); nested Plantilla cards label by task type so empty scope no longer shows `entity.task.query.scope.`.
- **Templates** / **MIA**: Duplicate prefix uses `common.copyPrefix` (was bare `copy_`).
- **Templates**: Nested Sources cards prefill Parameter fields from the open Plantilla’s saved defaults (parent overrides child task defaults unless the nested field is edited).

- **Layers**: Feature Information character-count hint no longer throws when `CharacterCountPipe` probes validators beside the string-assuming queryable-layers CSV validator; `parseLayerList` tolerates non-string probe values; apply `characterCount:500` on queryable layers.
- **Forms**: Restored modified-field highlight and translate-icon `(keydown)`; `CanDeactivateGuard` unsaved-changes ([#374](https://github.com/sitmun/sitmun-admin-app/issues/374)); route-id reload and save toolbar gated on loaded data; duplicate Save without extra edit ([#384](https://github.com/sitmun/sitmun-admin-app/issues/384)); plain-text URL/relation selects with `open_in_new` suffix ([#376](https://github.com/sitmun/sitmun-admin-app/issues/376)).
- **Trees**: Field-config booleans and Label default Extra info across dialog close ([#432](https://github.com/sitmun/sitmun-admin-app/issues/432)); radio/`loadByDefault` persistence and child validation; Applications/Roles relation grids link names (no id column).
- **Languages**: Translation dialog Accept gated on real edits; chrome menus refresh via `languagesToUse$`; list columns endonym / UI-locale name / Active / Order; endonym rows persist in `STM_TRANSLATION` for `Language.name`.
- **Services** / **Connections** / **Configuration Parameters**: Multilingual WMS Title/Abstract prefill into translation rows ([#46](https://github.com/sitmun/sitmun-application-stack/issues/46)); proxy+auth card with credentials disabled until proxy enabled; saved connection `GET …/test` without re-password ([#424](https://github.com/sitmun/sitmun-admin-app/issues/424)); proxy save shows normalization/default warnings ([#431](https://github.com/sitmun/sitmun-admin-app/issues/431)).
- **Layers** / **Territory** / **Background layers** / **Layers permits**: CSV mapping for `layers`/`queryableLayers`/`selectableLayers`; style dialog legend nesting; Trees tab keeps selection checkbox; Cartography/Permissions/Tasks dual navigation; Image URL open action; Type select keeps out-of-filter values.
- **Application** / **Task groups** / **Data grid** / **Dialogs** / **Navigation**: Parameters updater binds service update/delete; backgrounds order persists via HAL resources ([#428](https://github.com/sitmun/sitmun-admin-app/issues/428)); task-group add/remove persistence; `autoSizeStrategy`/status-dot fixes; dialog Add waits for validation; connection/task deep links corrected.
- **Auth** / **Messages** / **UX**: Backend URL matching hardened; `/api/account` 401 treated as anonymous; 401 toasts skipped for auth-expired flow; forbidden responses keep session with one notification; primary boolean accents; experimental tab icons `aria-hidden`.

### Removed

- **Auth** / **User**: Unused authority directives and `Principal` helpers; built-in `public`/`admin` forms no longer show the applications-as-point-of-contact tab ([#316](https://github.com/sitmun/sitmun-admin-app/issues/316)).

### Security

- **Templates**: ADMIN preview uses trusted HTML (`bypassSecurityTrustHtml`); editor validator is not a sanitizer — persisted HTML must be sanitized at viewer render ([#162](https://github.com/sitmun/sitmun-viewer-app/issues/162) / DOMPurify).
- **Auth** / **Forms**: Login via `POST /api/authenticate/admin` for `admin_access_token`; `AuthInterceptor` sends `X-SITMUN-Client: admin`; service, task-query, and connection password inputs use `type="password"` (BUG-033).

## [1.2.7] - 2026-06-05

### Added

- **Trees**: improved authoring UX with image validation (PNG/JPEG, 2 MB), duplicate-name save checks, node cartography/task linkage, hidden-in-viewer indicators, and unsaved-changes confirmation.
- **Trees**: introduced shared `TreeRulesService` for tree-type node behavior and validation rules.
- **User management**: richer user form guidance and validation UX (hints, counters, tab lead text, compact warnings with tab indicators) plus new read-only “Applications (point of contact)” tab and extended user-list columns.
- **User form relations**: manual territory picker for positions, relation-grid layout improvements, and i18n support for role/position warnings and tab guidance across all locales.
- **i18n**: completed missing keys for user hints/warnings and tab lead messages in ca/en/es/fr/oc-aranes; updated application creator hint wording for email-only publication.
- **Form alerts**: added shared `app-entity-form-alerts` + `FormFieldLabelResolver` for in-form validation/warning display; added compact warnings-panel mode and supporting global styles.
- **Data grid**: added dedicated clientSide/infinite column-layout paths, fixed-width selection checkbox column, and centered checkbox cell styling.

### Changed

- **Trees**: save trigger routed through `onTreeSaveRequested`; batch-delete tests and tree-form test helpers were extracted.
- **Entity forms**: required-field feedback and cross-tab warnings moved to `app-entity-form-alerts`; toolbar simplified to title/save/back.
- **Application form**: backend warnings and touristic tree rules now surface in alerts card; private-app/public-user warning shows on Roles tab.
- **User form**: alerts card moved above tabs, invalid-state indicators added, and toolbar/form internals simplified (`itemName`, `isNewOrDuplicated`, dead code removal, readonly table definitions).
- **Territory form**: `defaultZoomLevel` is now a standard extent-adjacent field and extent hints reflect runtime zoom behavior.
- **Data grid**: status column sizing/filter behavior tightened; Roles tab territorial-role column renamed with editable boolean renderer and clearer propagation context.
- **i18n**: position-warning semantics aligned with backend (`name`/`organization` required), blocked-user hint wording refined, and locale string corrections applied (including ca/es date labels).
- **Tests/tooling**: deprecated Angular test modules replaced with provider-based setup; `APP_INITIALIZER` moved to `provideAppInitializer`; TypeScript/ESLint/Node type tooling updated.
- **Build**: dev bundle budgets raised to 20 MB / 24 MB.

### Removed

- `FormValidationBannerComponent` (`app-form-validation-banner`) and toolbar validation/custom-warning inputs were removed from admin form toolbars and `sitmun-frontend-gui` exports.
- Feature flag `TERRITORY_FOCAL_POINT_FEATURE` and related `featureFlags.territoryFocalPoint.description` i18n keys.
- Territory form: separate `entity.territory.hint.defaultZoomLevel` field hint (covered by extent hint).

### Fixed

- Data grid: undo/redo handling fixed (counter timing, `source: 'undo'|'redo'`, boolean handling, checkbox stack behavior).
- Grid/list Jest expectations; `tsconfig.app.json` excludes test-only paths.

## [1.2.6] - 2026-05-08

### Added

- Functional route guard (`authGuard`, `CanActivateFn`) on the authenticated layout so access to the shell waits on a resolved identity from `Principal`.
- `LoginService` for credential login (`firstValueFrom` + `Principal.identity`), OIDC initiation (`initOidcLogin` with `client_type=admin`), `getEnabledAuthMethods`, and coordinated logout shared by the login page, toolbar, `AppComponent`, and `AuthExpiredInterceptor`.
- Jest coverage for `CallbackComponent` and expanded specs around login/auth where they ship with this change.

### Changed

- ngx-translate keys `callback.processing` and `callback.redirect` added across ca, en, es, fr, and oc-aranes for the post-OIDC callback screen.
- HttpClient cookie sessions: `AuthInterceptor` clones requests with `withCredentials: true`; `AuthService` authenticate and logout use `observe: 'response'` with the same flag.
- `AuthExpiredInterceptor` clears authentication through `LoginService` on 401/403 outside `authenticate` and the login route, with a redirect guard to avoid repeated navigation loops.
- `CallbackComponent` implemented as a standalone component (`TranslateModule` imports); after the OIDC redirect it navigates to the dashboard when identity exists, otherwise shows localized error feedback via `NotificationService`.
- GitHub Actions CI uses Node.js 20.19 (aligned with `package.json` engines and `.nvmrc`), runs ESLint before unit tests, and builds with the `production` Angular configuration and `/admin-app/` base href (the previous `testdeployment` profile is not defined in `angular.json`).
- `.npmrc` sets `legacy-peer-deps=true` so `npm ci` stays reproducible on npm 10 while the lockfile carries compatible-but-strict peer skew across `@angular/*` patch lines.

### Fixed

- ESLint `import/order` in `tree-node.service.spec.ts` and an unused spy binding in `data-tree.component.spec.ts` so `ng lint` passes in CI.
- Tree duplication: Save stays consistent when switching tabs (`canSave` matches `canSaveEntity`); Save is not enabled solely because the form is a duplicate—it follows real edits (form, grids, translations, or tree node pending changes). Saving from any tab still persists header and structure together (sitmun-admin-app#392).
- Task forms: align parameter modals and fix duplicate columns in task-edit grid.

## [1.2.5] - 2026-03-11

### Added

- Missing translations tracker dev tool with sidebar UI for identifying untranslated keys during development.
- Comprehensive test coverage for TreeNodeService achieving 100% statements, branches, functions, and lines coverage.
- Extensive test coverage improvements for TreesFormComponent and DataTreeComponent.
- Test suites for TreeNodeService covering all CRUD operations, relation management (tree, cartography, task, parent), and error handling scenarios.

### Changed

- Standardized form validation labels to use consistent `entity.*` i18n keys across all entity forms.
- Reorganized and completed all locale files (ca, en, es, fr, oc-aranes) with alphabetically sorted keys.
- **DataTreeComponent modernization**: Replaced deprecated Angular Material Tree APIs with modern `childrenAccessor` pattern, improving performance and maintainability.
- TreesFormComponent enhanced with tree type change warning dialog when existing nodes may be incompatible.
- TreeNodesComponent updated to work with modernized DataTreeComponent API and emit proper tree node updates.
- Type safety improvements throughout tree management components with proper TypeScript interfaces.
- Tree Structure tab content now loads lazily and tree rendering waits for codelist initialization to avoid early heavy work on form open.
- Tree/data-tree rendering callbacks were stabilized and node type/view mode label resolution now uses caches to reduce change detection churn.
- Tree node unit tests now rebuild codelist caches after injecting mocked codelists to match runtime behavior.

### Fixed

- Shortened Catalan label for permission groups to "Permisos a capes".
- Removed `[DEV]` prefix from trigger test error label in all locales.
- DataTreeComponent subscription cleanup using `takeUntilDestroyed` to prevent memory leaks.
- Tree expansion state persistence when filtering and reordering nodes.
- Restored tree save-constraint explanation banner in the toolbar by wiring `treeValidationWarningMessage` into `app-form-toolbar`.
- Resolved tree form unresponsiveness when opening existing trees and when entering the Tree Structure tab.
- Updated problem-detail translation-key tests to use the `backend.error.*` namespace.
- Removed temporary debugging instrumentation introduced during freeze/root-cause investigation.

### Removed

- Unused frontend-gui locale files (`src/app/frontend-gui/src/assets/i18n`).

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

[Unreleased]: https://github.com/sitmun/sitmun-admin-app/compare/sitmun-admin-app/1.2.8...HEAD
[1.2.8]: https://github.com/sitmun/sitmun-admin-app/compare/sitmun-admin-app/1.2.7...sitmun-admin-app/1.2.8
[1.2.7]: https://github.com/sitmun/sitmun-admin-app/compare/sitmun-admin-app/1.2.6...sitmun-admin-app/1.2.7
[1.2.6]: https://github.com/sitmun/sitmun-admin-app/compare/sitmun-admin-app/1.2.5...sitmun-admin-app/1.2.6
[1.2.5]: https://github.com/sitmun/sitmun-admin-app/compare/sitmun-admin-app/1.2.4...sitmun-admin-app/1.2.5
[1.2.4]: https://github.com/sitmun/sitmun-admin-app/compare/sitmun-admin-app/1.2.3...sitmun-admin-app/1.2.4
[1.2.3]: https://github.com/sitmun/sitmun-admin-app/compare/sitmun-admin-app/1.2.2...sitmun-admin-app/1.2.3
[1.2.2]: https://github.com/sitmun/sitmun-admin-app/compare/sitmun-admin-app/1.2.1...sitmun-admin-app/1.2.2
[1.2.1]: https://github.com/sitmun/sitmun-admin-app/compare/sitmun-admin-app/1.2.0...sitmun-admin-app/1.2.1
[1.2.0]: https://github.com/sitmun/sitmun-admin-app/compare/sitmun-admin-app/1.1.1...sitmun-admin-app/1.2.0
[1.1.1]: https://github.com/sitmun/sitmun-admin-app/compare/sitmun-admin-app/1.1.0...sitmun-admin-app/1.1.1
[1.1.0]: https://github.com/sitmun/sitmun-admin-app/compare/sitmun-admin-app/1.0.0...sitmun-admin-app/1.1.0
[1.0.0]: https://github.com/sitmun/sitmun-admin-app/releases/tag/sitmun-admin-app/1.0.0
