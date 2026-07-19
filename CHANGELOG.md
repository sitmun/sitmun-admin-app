# Changelog

All notable changes to this project will be documented in this file. The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- **Trees**: cartography folder form toggle for `loadData` (orthogonal to radio); persists via projection and save path ([sitmun-viewer-app#45](https://github.com/sitmun/sitmun-viewer-app/issues/45)).
- **Trees**: admin tree shows a `check_box` badge for `loadData` folders (same pattern as radio), with i18n “load control” copy ([sitmun-viewer-app#45](https://github.com/sitmun/sitmun-viewer-app/issues/45)).
- **Trees**: cartography leaf form toggle for `queryableActive` (GFI marker in the viewer catalog when the linked layer also has `queryableFeatureEnabled`); toggle is disabled and cleared when no layer is linked or layer GetFeatureInfo is off; admin tree shows an `i` badge when the node flag is on ([sitmun-viewer-app#45](https://github.com/sitmun/sitmun-viewer-app/issues/45)).
- **Application**: optional responsible institution field, eligible point-of-contact selector (built-in/blocked excluded), application-list warning indicator, and user-form impact warnings when an assigned PoC is blocked or loses email ([#316](https://github.com/sitmun/sitmun-admin-app/issues/316)).
- **User**: built-in `public` and `admin` user forms no longer show the applications-as-point-of-contact tab ([#316](https://github.com/sitmun/sitmun-admin-app/issues/316)).

### Fixed

- **Auth**: backend request matching normalizes relative, absolute, bare-domain, and default-port URLs while rejecting cross-origin and path-prefix lookalikes.
- **Forms**: route changes between records hide stale controls until the latest entity finishes loading, preventing edits from being discarded by a late form rebuild.
- **Task types**: list, task-group Tasks grids, and tree-node task pickers request `lang` so backend `@I18n` resolves `title` / `typeTitle`.
- **Territory/Tasks**: task type titles request `lang` so backend `@I18n` resolves `taskTypeTitle` for the UI language.
- **Grids**: boolean column headers are left-aligned and stay visible; selection checkboxes keep a separate header class; territory Permissions fills remaining width via flex on user/role while “applies to children” stays bounded.
- **Territory**: Cartography tab columns are name, layers, service (service navigable); Tasks Type shows the localized `taskTypeTitle` instead of the internal type name.
- **Territory**: Permissions, Cartography, and Tasks relation grids link user/role, layer/service, and task names with dual navigation.
- **Layers permits**: Type select keeps the current value visible when it is outside the create-time filter (e.g. background map groups opened by direct URL).
- **Background layers**: Image is treated as an optional http(s) URL with a new-tab open action, matching backend `@Http` semantics.
- **Trees**: Applications and Roles relation grids drop the id column and link names to the application/role forms, matching other relation grids.
- **Forms/URLs**: editable URL fields no longer navigate when their text is clicked; a Material-aligned suffix action opens valid URLs in a new tab, and grid external links use the same icon and accessibility contract.
- **Layers**: Service selection text is plain so the selector opens normally, with a new-tab icon retained; editable style legend URL cells keep plain text and isolate navigation to a separate icon ([#376](https://github.com/sitmun/sitmun-admin-app/issues/376)).
- **Layers**: Trees tab keeps a selection checkbox column so read-only rows can still be selected for download.
- **Services**: existing layers in the service form Layers grid link to the layer form; unregistered capability rows stay plain text and remain editable.
- **Forms**: relation selects and tree relation autocompletes keep plain selected text so controls open and edit normally; only the adjacent `open_in_new` icon navigates in a new tab. Entity lists and relation grids retain dual navigation ([#376](https://github.com/sitmun/sitmun-admin-app/issues/376)).
- **Trees**: radio folder persistence normalizes via `resolvePersistedRadio`; sibling load-by-default saves deactivate before activate to avoid backend radio conflicts; invalid direct children block radio enable and folder placement under radio parents.
- **Data grid**: resolves AG Grid `autoSizeStrategy` before grid initialization and no longer updates the Initial-only option after `onGridReady`, removing the console warning.
- **Services**: proxy and authentication are grouped in one card; authentication fields stay visible but are disabled until **Use SITMUN proxy** is enabled, and disabling proxy clears stored credentials in the form to match runtime behavior.
- **Services**: obtaining service details prefills `Service.name` and `Service.description` translation rows from alternate `xml:lang` entries; when the DB default language is absent from capabilities, the first entry still populates the main field and its language translation row (e.g. `ca` + `es` with default `en`) ([#46](https://github.com/sitmun/sitmun-application-stack/issues/46)).
- **Application parameters**: bind service update/delete in the parameters relation updater so saves no longer throw `TypeError`.
- **Application backgrounds**: relation order updates now persist on save by updating existing HAL resources instead of rebuilding rows without `_links` ([#428](https://github.com/sitmun/sitmun-admin-app/issues/428)).
- **Auth**: `Principal.identity()` treats `/api/account` 401 as anonymous instead of leaving a stale authenticated flag.
- **Messages**: skip error toast handling for 401 responses so auth-expired flow owns session cleanup.
- **Messages**: forbidden API responses preserve authentication state and produce one error notification.
- **Dialogs**: `dialog-form` and `dialog-grid` Add buttons no longer close before validation or row collection completes.
- **Dialogs**: dual-tab pickers preserve inactive grid selections via `preserveContent` and reset collection state between Add attempts.
- **Dialogs**: picker width heuristics account for flex columns; content area scrolls instead of reserving fixed empty height.
- **Layers**: filter/style modal booleans use primary slide toggles; boolean grid columns use bounded width; fix `add-gap` typo on feature-information field.
- **UX**: grid boolean checkboxes use primary accent; experimental tab icons are hidden from screen readers.

### Security

- **Auth**: login now calls `POST /api/authenticate/admin` to receive a scoped `admin_access_token` cookie; the previous shared `access_token` endpoint is no longer used.
- **Auth**: `AuthInterceptor` adds `X-SITMUN-Client: admin` to every backend request so the server targets the correct admin cookie for authentication and logout.

### Changed

- **Trees**: align tree node display options with backend semantics — `visible` controls catalog visibility, `active` controls load-by-default on cartography leaves; radio folder toggle is limited to cartography trees via config capability.
- **Auth**: `authGuard` reloads account identity with credentials, preserves cached identity on transient failures, and warns valid non-admin users that administrator rights are required.
- **Auth**: `AuthExpiredInterceptor` validates the session through `/api/account` after protected API 401 responses; concurrent failures share one probe, sequential transient failures show one warning until validation succeeds, and only a probe 401 clears local state and redirects to login without POSTing logout.
- **Auth**: explicit logout routes through `LoginService.logout()` returning an `Observable` so callers wait for backend cookie removal before navigation.
- **HAL**: HAL `Resource` and `AccountService` requests send `withCredentials: true` so session cookies reach the API.

### Removed

- **Auth**: remove `HasAnyAuthorityDirective`, `HasAnyAuthorityOnTerritoryDirective`, and unused `Principal` authority helpers from `@app/core`.

### Added

- **Tests**: Jest coverage for WMS metadata parsing, service-form translation prefill, coalesced auth/session validation, admin guard rights feedback, HAL credentials, dialog Add validation, grid selection batching, layers form markup, feature-flag icon a11y, dual internal-navigation markup, external URL suffix/grid renderers, and relation-selector/autocomplete overlay regression coverage.
