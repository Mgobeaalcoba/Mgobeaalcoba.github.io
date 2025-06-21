# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Project structure formalization: `.gitignore`, `LICENSE`, and `CHANGELOG.md`.

## [1.0.0] - 2024-07-28

### Added
- Initial version of the interactive CV.
- Dark, Light, and Terminal themes.
- Language switching (ES/EN).
- Dynamic population of experience, projects, skills, education, and certifications from data files.
- PDF generation functionality.
- Interactive intro screen.

### Fixed
- Professional Experience section not being visible due to CSS animation issues.
- Theme switching logic bugs.
- Terminal input and welcome message issues.
- Post-refactoring errors (module import, JSON parsing, hidden content).
- Various code smells and inconsistencies.

### Changed
- Centralized all theme management logic into `themes.js`.
- Refactored `intro.js` to decouple it from the main theme system.
- Centralized DOM and localStorage manipulation into `utils.js`.
- Improved PDF generation logic by building DOM elements programmatically.
- Reorganized CSS files for better separation of concerns.
- Translated all code comments to English and improved their clarity. 