# Changelog

All notable changes to this project will be documented in this file. The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Fixed

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

- **Tests**: Jest coverage for WMS metadata parsing, service-form translation prefill, coalesced auth/session validation, admin guard rights feedback, HAL credentials, dialog Add validation, grid selection batching, layers form markup, and feature-flag icon a11y.
