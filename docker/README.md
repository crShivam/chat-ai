# Docker Setup for pnpm Workspace Project

This directory contains Docker configurations for running the entire application, including frontend, backend, and database services.

## Docker Files Overview

- `Dockerfile`: Production-ready multi-stage build
- `Dockerfile.dev`: Development environment setup with hot-reload support
- `docker-compose.yml`: Production orchestration
- `docker-compose.dev.yml`: Development orchestration
- `nginx.conf`: Nginx configuration for the frontend service

## Development Environment

To start the development environment:

```bash
docker-compose -f docker-compose.dev.yml up
```

This will:

- Start a PostgreSQL database
- Run the backend NestJS application in watch mode
- Run the frontend Vite application with hot module replacement
- Mount your local code as volumes for real-time development

## Production Environment

To build and start the production environment:

```bash
docker-compose up --build -d
```

This will:

- Build optimized production images for both frontend and backend
- Start the PostgreSQL database
- Run the backend as a Node.js application
- Serve the frontend static files through Nginx
- Configure all necessary networking

## Environment Variables

The Docker Compose files include default environment variables. For production deployment, you should create a `.env` file or provide environment variables directly to override these defaults.

Important variables:

- `DATABASE_URL`: PostgreSQL connection string
- `NODE_ENV`: Application environment (development/production)
- `PORT`: Backend application port

## Database Migrations

When running the application for the first time, you need to run the database migrations:

```bash
# In development mode
docker-compose -f docker-compose.dev.yml exec backend npx prisma migrate deploy

# In production mode
docker-compose exec backend npx prisma migrate deploy
```

## IndexedDB Data Persistence

Note that the IndexedDB implementation for persisting booking form data on the frontend works with the containerized setup without any modifications. The data is stored in the browser and will be automatically saved/restored as defined in the implementation.
