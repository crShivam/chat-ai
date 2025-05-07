FROM node:20-alpine AS base

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Set working directory
WORKDIR /app

# Set pnpm store directory to avoid permission issues
ENV PNPM_HOME=/app/.pnpm-store
RUN mkdir -p $PNPM_HOME

# Copy package.json files
FROM base AS installer
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/backend/package.json ./apps/backend/package.json
COPY apps/frontend/package.json ./apps/frontend/package.json
COPY packages/eslint-config/package.json ./packages/eslint-config/package.json
COPY packages/tsconfig/package.json ./packages/tsconfig/package.json

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Generate Prisma client
RUN cd apps/backend && npx prisma generate

# Build backend
FROM installer AS backend-builder
RUN pnpm --filter ./apps/backend build

# Build frontend
FROM installer AS frontend-builder
RUN pnpm --filter ./apps/frontend build

# Backend runtime
FROM base AS backend
COPY --from=installer /app/node_modules /app/node_modules
COPY --from=installer /app/apps/backend/node_modules /app/apps/backend/node_modules
COPY --from=installer /app/packages /app/packages
COPY --from=backend-builder /app/apps/backend/dist /app/apps/backend/dist
COPY --from=installer /app/apps/backend/prisma /app/apps/backend/prisma

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Expose port
EXPOSE 3000

WORKDIR /app/apps/backend
CMD ["node", "dist/main"]

# Frontend runtime
FROM nginx:alpine AS frontend
COPY --from=frontend-builder /app/apps/frontend/dist /usr/share/nginx/html
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
