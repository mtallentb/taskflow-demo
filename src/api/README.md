# TaskFlow API

A comprehensive Express.js REST API for task management with TypeScript support, validation, error handling, and comprehensive CRUD operations.

## Features

- ✅ **Full CRUD Operations** - Create, Read, Update, Delete tasks
- 🔍 **Advanced Filtering** - Filter by status, priority, assignee, project, tags, due dates
- 📄 **Pagination & Sorting** - Paginated results with customizable sorting
- ✨ **Data Validation** - Request validation using Joi schemas
- 🛡️ **Error Handling** - Comprehensive error handling with proper HTTP status codes
- 📊 **Task Statistics** - Get task statistics by status and priority
- 🔒 **Security** - CORS, Helmet, and security best practices
- 📋 **Request Logging** - Morgan-based request logging with unique request IDs
- 💪 **TypeScript** - Full TypeScript support with shared type definitions

## API Endpoints

### Tasks

- `POST /api/v1/tasks` - Create a new task
- `GET /api/v1/tasks` - Get tasks with filtering, pagination, and sorting
- `GET /api/v1/tasks/stats` - Get task statistics
- `GET /api/v1/tasks/:id` - Get a specific task by ID
- `PUT /api/v1/tasks/:id` - Update a task
- `DELETE /api/v1/tasks/:id` - Delete a task

### Health

- `GET /health` - Health check endpoint

## Quick Start

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run tests
npm test

# Type checking
npm run typecheck

# Linting
npm run lint
```

## API Usage Examples

### Create a Task

```bash
curl -X POST http://localhost:3000/api/v1/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Implement user authentication",
    "description": "Add JWT-based authentication system",
    "status": "todo",
    "priority": "high",
    "dueDate": "2024-12-31T23:59:59.000Z",
    "tags": ["backend", "security"]
  }'
```

### Get Tasks with Filtering

```bash
# Get high priority tasks
curl "http://localhost:3000/api/v1/tasks?priority=high&limit=5&sortBy=dueDate&sortOrder=asc"

# Get tasks by status and assignee
curl "http://localhost:3000/api/v1/tasks?status=in_progress&assigneeId=123e4567-e89b-12d3-a456-426614174000"

# Get tasks with tags
curl "http://localhost:3000/api/v1/tasks?tags=backend,security"
```

### Update a Task

```bash
curl -X PUT http://localhost:3000/api/v1/tasks/123e4567-e89b-12d3-a456-426614174000 \
  -H "Content-Type: application/json" \
  -d '{
    "status": "in_progress",
    "priority": "urgent"
  }'
```

### Get Task Statistics

```bash
curl http://localhost:3000/api/v1/tasks/stats
```

## Request/Response Examples

### Create Task Response

```json
{
  "success": true,
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "title": "Implement user authentication",
    "description": "Add JWT-based authentication system",
    "status": "todo",
    "priority": "high",
    "assigneeId": null,
    "projectId": null,
    "dueDate": "2024-12-31T23:59:59.000Z",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z",
    "tags": ["backend", "security"]
  },
  "message": "Task created successfully"
}
```

### Get Tasks Response

```json
{
  "success": true,
  "data": {
    "data": [
      {
        "id": "123e4567-e89b-12d3-a456-426614174000",
        "title": "Implement user authentication",
        "status": "todo",
        "priority": "high",
        // ... other fields
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 25,
      "totalPages": 3
    }
  }
}
```

### Task Statistics Response

```json
{
  "success": true,
  "data": {
    "total": 25,
    "byStatus": {
      "todo": 10,
      "in_progress": 8,
      "in_review": 4,
      "done": 3,
      "cancelled": 0
    },
    "byPriority": {
      "low": 5,
      "medium": 12,
      "high": 6,
      "urgent": 2
    }
  }
}
```

## Query Parameters

### Pagination & Sorting

- `page` (number, default: 1) - Page number
- `limit` (number, default: 10, max: 100) - Items per page
- `sortBy` (string, default: 'createdAt') - Sort field: 'createdAt', 'updatedAt', 'dueDate', 'priority', 'title'
- `sortOrder` (string, default: 'desc') - Sort order: 'asc', 'desc'

### Filtering

- `status` (string) - Task status: 'todo', 'in_progress', 'in_review', 'done', 'cancelled'
- `priority` (string) - Task priority: 'low', 'medium', 'high', 'urgent'
- `assigneeId` (UUID) - Filter by assignee
- `projectId` (UUID) - Filter by project
- `tags` (string or array) - Filter by tags
- `dueBefore` (ISO date) - Tasks due before this date
- `dueAfter` (ISO date) - Tasks due after this date

## Error Handling

The API returns consistent error responses:

```json
{
  "success": false,
  "error": "ValidationError",
  "message": "Validation failed",
  "statusCode": 400,
  "details": [
    {
      "field": "title",
      "message": "Title is required"
    }
  ]
}
```

## Environment Variables

- `PORT` (default: 3000) - Server port
- `HOST` (default: 0.0.0.0) - Server host
- `NODE_ENV` (default: development) - Environment mode

## Development

The API is built with:

- **Express.js** - Web framework
- **TypeScript** - Type safety
- **Joi** - Request validation
- **Morgan** - Request logging
- **Helmet** - Security headers
- **CORS** - Cross-origin resource sharing
- **UUID** - Unique identifier generation

## Architecture

```
src/
├── app.ts              # Express app configuration
├── server.ts           # Server startup and shutdown
├── controllers/        # Request handlers
│   └── taskController.ts
├── middleware/         # Custom middleware
│   ├── errorHandler.ts # Error handling
│   ├── logging.ts      # Request logging
│   └── validation.ts   # Request validation
├── routes/            # Route definitions
│   ├── tasks.ts       # Task routes
│   └── health.ts      # Health check routes
└── services/          # Business logic
    └── taskService.ts # Task operations
```

## License

MIT