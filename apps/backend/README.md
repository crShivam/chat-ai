# Backend - Note Taking Application

[![NestJS](https://img.shields.io/badge/NestJS-11.0.1-red.svg)](https://nestjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-6.6.0-green.svg)](https://www.prisma.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)](https://www.typescriptlang.org/)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue.svg)](https://www.docker.com/)

Robust API server for the note-taking application built with NestJS, Prisma, and TypeScript, featuring Gemini AI integration for automatic note summaries.

## Features

- **RESTful API**: Well-designed endpoints following REST principles
- **Database Integration**: PostgreSQL with Prisma ORM
- **Data Validation**: Input validation using class-validator and class-transformer
- **API Documentation**: Swagger UI for easy API exploration
- **Authentication**: JWT-based authentication system
- **Error Handling**: Comprehensive error handling with custom exceptions
- **Docker Support**: Containerized for easy deployment
- **Type Safety**: End-to-end type safety with TypeScript
- **AI Integration**: Note summaries generated with Google's Gemini AI

## Technology Stack

- **NestJS**: Progressive Node.js framework
- **Prisma**: Next-generation ORM for Node.js and TypeScript
- **PostgreSQL**: Relational database for persistent storage
- **TypeScript**: For type safety and better developer experience
- **JWT**: For secure authentication
- **Swagger**: API documentation
- **Docker**: For containerization
- **Gemini AI**: For generating note summaries

## Directory Structure

```
backend/
├── prisma/                # Prisma schema and migrations
├── src/
│   ├── notes/            # Notes module
│   ├── users/            # Users module
│   ├── auth/             # Authentication module
│   ├── gemini/           # Gemini AI integration
│   ├── common/           # Shared utilities, pipes, filters
│   ├── config/           # Configuration
│   ├── app.module.ts     # Main application module
│   └── main.ts           # Application entry point
├── test/                 # Test files
└── ...config files       # Various configuration files
```

## Getting Started

### Development

```bash
# Install dependencies from the root of the monorepo
pnpm install

# Generate Prisma client
pnpm prisma generate

# Run database migrations
pnpm prisma migrate dev

# Configure Gemini API key
echo "GEMINI_API_KEY=your_api_key_here" >> .env

# Start the development server
pnpm dev
```

### Gemini AI Integration

To enable AI-generated note summaries, you need to:

1. Get a Gemini API key from [Google AI Studio](https://ai.google.dev/).
2. Add the API key to your .env file:
   ```
   GEMINI_API_KEY=your_api_key_here
   ```
3. When creating notes with content longer than 200 characters, the system will automatically generate a summary.

If the API key is not provided or the note content is short, the system will function normally but won't generate summaries.

### Build

```bash
# Build for production
pnpm build

# Start production server
pnpm start:prod
```

## API Endpoints

The API provides the following main endpoints:

- **Authentication**: User login and registration
- **Notes**: Creating, reading, updating, and deleting notes
- **Users**: User profile management

## Database Schema

The application uses a PostgreSQL database with the following main entities:

- **Users**: User accounts and profiles
- **Notes**: Note content, metadata, and AI-generated summaries

## Docker Configuration

The backend is containerized using Docker and can be run with:

```bash
# Development mode with hot-reload
docker-compose -f docker-compose.dev.yml up -d

# Production mode
docker-compose up -d
```

The Dockerfile is optimized with multi-stage builds for minimal image size and efficient caching.

## Testing

```bash
# Run unit tests
pnpm test

# Run e2e tests
pnpm test:e2e

# Generate test coverage reports
pnpm test:cov
```
