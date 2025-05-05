# ESLint Configuration Package

[![ESLint](https://img.shields.io/badge/ESLint-9.21.0-purple.svg)](https://eslint.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)](https://www.typescriptlang.org/)

Shared ESLint configuration for the Notes AI Application

## Overview

This package provides standardized ESLint configurations to ensure consistent code formatting and best practices across all projects in the monorepo. It extends recommended configurations and includes custom rules tailored for the project needs.

## Features

- **Standardized Rules**: Consistent linting rules for all applications
- **TypeScript Support**: Enhanced rules for TypeScript codebases
- **React-specific Rules**: Configuration for React components and hooks
- **Shared Configuration**: Single source of truth for all ESLint rules

## Usage

### Installation

This package is automatically available to all projects in the monorepo via workspace dependencies.

In your project's `package.json`:

```json
"devDependencies": {
  "@notesai/eslint-config": "workspace:*"
}
```

### Configuration

In your project's ESLint configuration file, extend this shared configuration:

```js
// eslint.config.js
import { notesAiConfig } from '@notesai/eslint-config';

export default [
  ...notesAiConfig,
  // Add any project-specific overrides here
];
```

## Rules Overview

The shared configuration includes rules for:

- Code style consistency
- Error prevention
- TypeScript type checking
- React hooks usage
- Performance best practices
- Accessibility requirements

## Customization

While the shared configuration should work for most use cases, you can override or extend rules in your project's ESLint configuration as needed.
