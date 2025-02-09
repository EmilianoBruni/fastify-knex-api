# fastify-knex-api - Changelog

_Fastify plugin to expose API for Knex Query Builder_

All notable changes to this project will be documented in this file.

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

