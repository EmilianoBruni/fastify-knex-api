# fastify-knex-api - Changelog

_Fastify plugin to expose API for Knex Query Builder_

All notable changes to this project will be documented in this file.

## [0.4.1] 2026-01-30

### Changed

- Updated to latest packages. Fastify is 5.7.2.

### Fixed

- Add pnpm configuration for built patched knex-schema-inspector.

## [0.4.0] 2025-08-23

### Added

- Support for combined (multiple primary) keys

### Fixed

- According to crud specifications, changed response status codes to 201 for create (POST) operations. This is a (partial) **_break compatibility_**
- According to crud specifications, included Location header in response for created records

## [0.3.4] 2025-04-28

### Changed

- Updated to latest packages

### Fixed

- Minor fix

## [0.3.3] 2025-02-27

### Added

- Support (automatic) for includeTriggerModifications in MSSQL

### Fixed

- Remove redundant assignment in create
- Wrong return record in update if client support returning record

## [0.3.2] 2025-02-10

### Changed

- Tests in typescript

### Fixed

- checkAuth func which is async

## [0.3.1] 2025-02-09

### Added

- It's now possible to select which CRUD verbs to expose

## [0.3.0] 2025-02-08

### Added

- Add support for 'uniqueidentifier' column type
- Add columnSchema option for custom column schema handling

### Changed

- Updated to Fastify 5.x

### Fixed

- Solved a bug while manual setting primari key if a primary key has not been found
- Minor Fix in documentation

## [0.2.2] 2024-02-08

### Fixed

- Export missing IKAPluginOptions type

## [0.2.1] 2024-02-06

### Fixed

- Add to published file the declaration for fastify decoration

## [0.2.0] 2024-01-28

### Added

- Converted to Typescript

## [0.1.2] 2024-01-22

### Added

- Add support for commonJS

## [0.1.1] 2024-01-20

### Fixed

- bit return binary, not integer
- set type field return string not array

## [0.1.0] 2024-01-11

### Added

- First public release
