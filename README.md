# Complaint Management System

## Overview

This is a full-stack complaint management system built with React, Express, and PostgreSQL. The application allows users to submit complaints with images and provides an admin interface for managing and reviewing these complaints. The system features a modern UI built with shadcn/ui components and uses Drizzle ORM for database operations.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and building
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database ORM**: Drizzle ORM for type-safe database operations
- **Authentication**: Express sessions with bcrypt for password hashing
- **File Upload**: Multer middleware for handling image uploads
- **API Design**: RESTful API with proper error handling and logging

### Database Design
- **Database**: PostgreSQL via Neon serverless
- **Schema Management**: Drizzle Kit for migrations and schema management
- **Tables**: 
  - `complaints` table for storing complaint data with image paths
  - `admins` table for admin authentication

### Authentication & Authorization
- **Session Management**: Express sessions with PostgreSQL session store
- **Password Security**: bcrypt for hashing admin passwords
- **Route Protection**: Middleware-based authentication for admin routes
- **Client-side Auth**: React Query integration for auth state management

### File Storage
- **Image Upload**: Local file storage using multer
- **File Validation**: Image type and size restrictions (5MB limit)
- **Storage Location**: Local uploads directory with automatic creation

### Development Features
- **Hot Reload**: Vite HMR for frontend development
- **TypeScript**: Full type safety across frontend and backend
- **Path Aliases**: Configured for clean imports (@/, @shared/)
- **Error Handling**: Comprehensive error boundaries and API error handling
- **Logging**: Request logging with duration tracking for API endpoints

## External Dependencies

### Core Technologies
- **Frontend**: React, Vite, TypeScript
- **Backend**: Node.js, Express, TypeScript
- **Database**: PostgreSQL (Neon serverless)
- **ORM**: Drizzle ORM with Drizzle Kit

### UI & Styling
- **Component Library**: Radix UI primitives
- **Design System**: shadcn/ui components
- **Styling**: Tailwind CSS with PostCSS
- **Icons**: Lucide React icons
- **Fonts**: Google Fonts (Roboto, Font Awesome)

### State Management & Data Fetching
- **Server State**: TanStack Query (React Query)
- **Form Management**: React Hook Form
- **Validation**: Zod schema validation

### Authentication & Security
- **Password Hashing**: bcrypt
- **Session Management**: express-session
- **Session Store**: connect-pg-simple for PostgreSQL

### File Handling
- **File Uploads**: multer middleware
- **File Type Validation**: Built-in multer filtering

### Development Tools
- **Build Tool**: Vite with React plugin
- **Runtime Error Handling**: Replit-specific error overlay
- **Development Banner**: Replit development environment integration