# Changelog

All notable changes to this project will be documented in this file. The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Fixed

- **Data grid**: resolves AG Grid `autoSizeStrategy` before grid initialization and no longer updates the Initial-only option after `onGridReady`, removing the console warning.
- **Services**: proxy and authentication are grouped in one card; authentication fields stay visible but are disabled until **Use SITMUN proxy** is enabled, and disabling proxy clears stored credentials in the form to match runtime behavior.
- **Services**: obtaining service details prefills `Service.name` and `Service.description` translation rows from alternate `xml:lang` entries; when the DB default language is absent from capabilities, the first entry still populates the main field and its language translation row (e.g. `ca` + `es` with default `en`) ([#46](https://github.com/sitmun/sitmun-application-stack/issues/46)).
- **Application parameters**: bind service update/delete in the parameters relation updater so saves no longer throw `TypeError`.
- **Application backgrounds**: relation order updates now persist on save by updating existing HAL resources instead of rebuilding rows without `_links` ([#428](https://github.com/sitmun/sitmun-admin-app/issues/428)).

### Added

- **Tests**: Jest coverage for multilingual WMS metadata parsing (`WMSCapabilitiesService`) and service-form translation prefill on metadata fetch.
