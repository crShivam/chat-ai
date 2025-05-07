# AI-Powered Note Taking Application

[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)](https://www.typescriptlang.org/)
[![NestJS](https://img.shields.io/badge/NestJS-11.0.1-red.svg)](https://nestjs.com/)
[![React](https://img.shields.io/badge/React-19.0.0-blue.svg)](https://reactjs.org/)
[![Gemini AI](https://img.shields.io/badge/Gemini-AI-orange.svg)](https://ai.google.dev/)

A modern note-taking application that automatically generates AI-powered summaries of your notes using Google's Gemini AI.

## Features

- **Smart Note Taking**: Create, edit, and organize your notes
- **AI Summaries**: Automatic generation of concise summaries using Gemini AI
- **Real-time Updates**: Instant saving and synchronization
- **Modern UI**: Clean and intuitive user interface
- **Type Safety**: Built with TypeScript for better development experience
- **Responsive Design**: Works seamlessly across all devices

## Project Structure

This is a monorepo containing:

- `apps/backend`: NestJS backend with Gemini AI integration
- `apps/frontend`: React frontend with modern UI components
- `packages/`: Shared configurations and utilities

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- pnpm (v8 or higher)
- Gemini AI API key

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd mason-task

# Install dependencies
pnpm install

# Set up environment variables
cp apps/backend/.env.example apps/backend/.env
cp apps/frontend/.env.example apps/frontend/.env

# Add your Gemini API key to backend/.env
echo "GEMINI_API_KEY=your_api_key_here" >> apps/backend/.env
```

### Development

```bash
# Start backend development server
cd apps/backend
pnpm dev

# Start frontend development server
cd apps/frontend
pnpm dev
```

### Building for Production

```bash
# Build backend
cd apps/backend
pnpm build

# Build frontend
cd apps/frontend
pnpm build
```

## Technology Stack

### Backend
- NestJS
- TypeScript
- Prisma
- PostgreSQL
- Gemini AI API

### Frontend
- React
- TypeScript
- Vite
- Tailwind CSS
- Radix UI

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
