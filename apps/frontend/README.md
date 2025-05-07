# Frontend - Note Taking Application

[![React](https://img.shields.io/badge/React-19.0.0-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.2.0-purple.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1.4-teal.svg)](https://tailwindcss.com/)

Modern, responsive note-taking frontend built with React, TypeScript, and Vite, featuring AI-powered note summaries.

## Features

- **Beautiful UI Components**: Built with Radix UI and styled with Tailwind CSS
- **Rich Text Editor**: Create and edit notes with formatting options
- **AI Summaries**: View AI-generated summaries of your notes
- **Real-time Updates**: Instant saving and synchronization
- **Toast Notifications**: Real-time feedback for user actions
- **Type Safety**: Comprehensive TypeScript typing throughout the application
- **Modern React Patterns**: Uses latest React 19 features and best practices
- **Responsive Design**: Optimized for all screen sizes

## Technology Stack

- **React 19**: For building the user interface
- **TypeScript**: For type safety and better developer experience
- **Vite**: Fast, modern frontend build tool
- **Tailwind CSS**: Utility-first CSS framework
- **React Hook Form**: Form state management with validation
- **Zod**: Schema validation library
- **React Query**: Data fetching and state management
- **React Router**: For application routing

## Directory Structure

```
frontend/
├── public/            # Static assets
├── src/
│   ├── components/    # UI components
│   │   ├── notes/     # Note-related components
│   │   └── ui/        # Reusable UI components
│   ├── hooks/         # Custom React hooks
│   ├── lib/           # Utility functions and shared logic
│   ├── pages/         # Application pages
│   ├── services/      # API services
│   ├── store/         # State management
│   ├── types/         # TypeScript type definitions
│   ├── App.tsx        # Main application component
│   └── main.tsx       # Application entry point
└── ...config files    # Various configuration files
```

## Getting Started

### Development

```bash
# Install dependencies from the root of the monorepo
pnpm install

# Start the development server
pnpm dev
```

### Build

```bash
# Build for production
pnpm build

# Preview the production build
pnpm preview
```

## Note Management

The application provides a seamless note-taking experience:

- Create and edit notes with a rich text editor
- View AI-generated summaries for longer notes
- Organize notes with tags and categories
- Real-time saving and synchronization
- Responsive design for all devices

## UI Components

The UI is built with reusable components using:

- Radix UI for accessible primitives
- Tailwind CSS for styling
- Custom component library for consistent design
- Responsive layouts for all device sizes
