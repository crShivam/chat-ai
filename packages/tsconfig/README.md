# TypeScript Configuration Package

[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)](https://www.typescriptlang.org/)

Shared TypeScript configuration for the  Notes Taking application.

## Overview

This package provides standardized TypeScript configurations to ensure consistent type checking and compiler options across all projects in the monorepo. It defines base configurations that can be extended by individual applications.

## Features

- **Standardized Compiler Options**: Consistent TypeScript settings for all applications
- **Path Aliases**: Common path resolution configuration
- **Strict Type Checking**: Enforced type safety throughout the codebase
- **Optimized Build Settings**: Performance-focused compilation options

## Usage

### Installation

This package is automatically available to all projects in the monorepo via workspace dependencies.

In your project's `package.json`:

```json
"devDependencies": {
  "@notesai/tsconfig": "workspace:*"
}
```

### Configuration

In your project's `tsconfig.json`, extend the shared configuration:

```json
{
  "extends": "@notesai/tsconfig/base.json",
  "compilerOptions": {
    "outDir": "./dist"
    // Add any project-specific options here
  },
  "include": ["src/**/*"]
}
```

## Available Configurations

The package includes multiple configuration files for different use cases:

- **base.json**: Base configuration for all TypeScript projects
- **react.json**: Configuration optimized for React applications

## Type Safety Benefits

Using shared TypeScript configurations provides several benefits:

- Ensures consistent type checking across all projects
- Prevents common type-related bugs
- Improves developer experience with better editor integration
- Enhances code maintainability and documentation
- Supports safer refactoring
