# Task Management System

A real-time task management system built with NestJS, featuring WebSocket support for live updates and a robust authentication system.

[![NestJS](https://img.shields.io/badge/NestJS-11.0.1-red.svg)](https://nestjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-6.18.0-blue.svg)](https://www.prisma.io/)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-4.8.1-green.svg)](https://socket.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7.3-blue.svg)](https://www.typescriptlang.org/)

## Features

- 🔐 **JWT Authentication**: Secure user authentication system
- 📝 **Task Management**: Create, update, and delete tasks with priorities and status
- 👥 **User Assignment**: Assign tasks to team members
- 💬 **Comments**: Add comments to tasks for better collaboration
- ⚡ **Real-time Updates**: WebSocket integration for live task updates
- 🔄 **Status Tracking**: Track task status (TODO, IN_PROGRESS, DONE)
- ⭐ **Priority Levels**: Set task priorities (LOW, MEDIUM, HIGH)
- 📦 **PostgreSQL + Prisma**: Robust data persistence and type-safe database access

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- npm or yarn package manager

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd task-management-nestjs
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
# Create .env file
cp .env.example .env

# Add your database URL and JWT secret
DATABASE_URL="postgresql://user:password@localhost:5432/taskdb?schema=public"
JWT_SECRET="your-secret-key"
```

4. Set up the database:
```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev
```

## Running the Application

### Development Mode
```bash
npm run start:dev
```

### Production Mode
```bash
npm run build
npm run start:prod
```

The server will start at `http://localhost:3001` by default.

## API Documentation

### Authentication Endpoints

- POST `/auth/register` - Register new user
- POST `/auth/login` - Login user

### Task Endpoints

- GET `/tasks` - List all tasks
- POST `/tasks` - Create new task
- GET `/tasks/:id` - Get task details
- PUT `/tasks/:id` - Update task
- DELETE `/tasks/:id` - Delete task

### Comments Endpoints

- POST `/tasks/:taskId/comments` - Add comment to task
- GET `/tasks/:taskId/comments` - Get task comments

## WebSocket Integration

The application supports real-time updates through WebSocket connections. 

### Connecting to WebSocket

```typescript
import { io } from 'socket.io-client';

const socket = io('ws://localhost:3001/events', {
  auth: {
    token: 'your-jwt-token'
  }
});
```

### Available Events

- `task.created` - New task created
- `task.updated` - Task updated
- `task.deleted` - Task deleted
- `comment.added` - New comment added

## Testing

```bash
# Unit tests
npm run test

# e2e tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## Project Structure

```
src/
├── auth/           # Authentication module
├── tasks/          # Task management module
├── websocket/      # WebSocket gateway and guards
├── prisma/         # Database schema and migrations
└── main.ts         # Application entry point
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| DATABASE_URL | PostgreSQL connection URL | - |
| JWT_SECRET | Secret key for JWT tokens | secretKey |
| PORT | Server port number | 3001 |

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Support

For support and questions:
- Open an issue in the repository
- Check the [NestJS documentation](https://docs.nestjs.com/)
- Refer to [Prisma documentation](https://www.prisma.io/docs/) for database-related queries

## License

This project is licensed under the [MIT License](LICENSE).
