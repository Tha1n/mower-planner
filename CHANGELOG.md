
# Change Log
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/) and this project adheres to [Semantic Versioning](http://semver.org/).

## [Unreleased] - yyyy-mm-dd

### Added

### Changed

### Fixed

## [0.0.6] - 2022-05-09

### Fixed
- Fix bug on authentication where first error does not clear properly data and then the service crash on every request to Husqvarna account

## [0.0.5] - 2022-05-04

### Fixed
- PR #9
- PR #10
- PR #11
- PR #12
- PR #13

## [0.0.4] - 2022-04-25

### Added
- SwaggerUI available on /swagger
- New API Controller: Cron. Return cron data.

### Changed
- Filter for logging. Now debug & verbose will not be log

### Fixed
- Remove useless files on Docker image

## [0.0.2] - 2022-04-22

### Added
- Cron job to call weather service + stop or resume Husqvarna Mower
- Healthchecks
- Docker push to Google Artefacts Registry
