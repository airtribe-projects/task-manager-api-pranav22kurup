# Task Manager API

A RESTful API for managing tasks built with Node.js and Express. This API allows you to create, read, update, and delete tasks with support for filtering, sorting, and priority levels.

## Overview

This Task Manager API provides a simple yet powerful interface for task management. It supports:
- CRUD operations for tasks
- Task filtering by completion status
- Task sorting by creation date
- Priority levels (low, medium, high)
- Filtering tasks by priority level

## Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js**: Version 18.0.0 or higher
- **npm**: Node Package Manager (comes with Node.js)

## Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd task-manager-api-pranav22kurup
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Verify the installation**
   The project includes a `task.json` file with sample tasks. No additional configuration is required.

## Running the Application

Start the server:
```bash
node app.js
```

The server will start on port 3000. You should see:
```
Server is listening on 3000
```

**Note:** The main entry point for the application is `app.js`.

## API Endpoints

### 1. Get All Tasks
Retrieve all tasks with optional filtering and sorting.

**Endpoint:** `GET /tasks`

**Query Parameters:**
- `completed` (optional): Filter by completion status (`true` or `false`)
- `sortBy` (optional): Sort tasks by creation date (`createdAt`)

**Examples:**
```bash
# Get all tasks
curl http://localhost:3000/tasks

# Get only completed tasks
curl http://localhost:3000/tasks?completed=true

# Get incomplete tasks sorted by creation date
curl http://localhost:3000/tasks?completed=false&sortBy=createdAt
```

**Response:** `200 OK`
```json
[
  {
    "id": 1,
    "title": "Set up environment",
    "description": "Install Node.js, npm, and git",
    "completed": true,
    "priority": "high",
    "createdAt": "2024-01-01T10:00:00.000Z"
  }
]
```

### 2. Get Task by ID
Retrieve a specific task by its ID.

**Endpoint:** `GET /tasks/:id`

**Example:**
```bash
curl http://localhost:3000/tasks/1
```

**Response:** `200 OK`
```json
{
  "id": 1,
  "title": "Set up environment",
  "description": "Install Node.js, npm, and git",
  "completed": true,
  "priority": "high",
  "createdAt": "2024-01-01T10:00:00.000Z"
}
```

**Error Response:** `404 Not Found`
```json
{
  "error": "Task not found"
}
```

### 3. Get Tasks by Priority
Retrieve all tasks with a specific priority level.

**Endpoint:** `GET /tasks/priority/:level`

**Priority Levels:** `low`, `medium`, `high`

**Examples:**
```bash
# Get all high priority tasks
curl http://localhost:3000/tasks/priority/high

# Get all medium priority tasks
curl http://localhost:3000/tasks/priority/medium

# Get all low priority tasks
curl http://localhost:3000/tasks/priority/low
```

**Response:** `200 OK`
```json
[
  {
    "id": 1,
    "title": "Set up environment",
    "description": "Install Node.js, npm, and git",
    "completed": true,
    "priority": "high",
    "createdAt": "2024-01-01T10:00:00.000Z"
  }
]
```

**Error Response:** `400 Bad Request`
```json
{
  "error": "Invalid priority level. Must be low, medium, or high"
}
```

### 4. Create a New Task
Create a new task.

**Endpoint:** `POST /tasks`

**Request Body:**
```json
{
  "title": "New Task",
  "description": "Task description",
  "completed": false,
  "priority": "medium"
}
```

**Required Fields:**
- `title` (string): Task title (cannot be empty)
- `description` (string): Task description (cannot be empty)
- `completed` (boolean): Completion status

**Optional Fields:**
- `priority` (string): Priority level (`low`, `medium`, or `high`). Defaults to `medium` if not provided.

**Example:**
```bash
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Complete assignment",
    "description": "Finish the Node.js assignment",
    "completed": false,
    "priority": "high"
  }'
```

**Response:** `201 Created`
```json
{
  "id": 16,
  "title": "Complete assignment",
  "description": "Finish the Node.js assignment",
  "completed": false,
  "priority": "high",
  "createdAt": "2024-01-10T14:30:00.000Z"
}
```

**Error Responses:**

`400 Bad Request` - Missing required fields:
```json
{
  "error": "Missing required fields"
}
```

`400 Bad Request` - Empty title or description:
```json
{
  "error": "Title and description cannot be empty"
}
```

`400 Bad Request` - Invalid completed value:
```json
{
  "error": "Completed must be a boolean value"
}
```

`400 Bad Request` - Invalid priority:
```json
{
  "error": "Priority must be low, medium, or high"
}
```

### 5. Update a Task
Update an existing task.

**Endpoint:** `PUT /tasks/:id`

**Request Body:**
```json
{
  "title": "Updated Task Title",
  "description": "Updated description",
  "completed": true,
  "priority": "low"
}
```

**Required Fields:**
- `title` (string): Task title (cannot be empty)
- `description` (string): Task description (cannot be empty)
- `completed` (boolean): Completion status

**Optional Fields:**
- `priority` (string): Priority level (`low`, `medium`, or `high`)

**Example:**
```bash
curl -X PUT http://localhost:3000/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated environment setup",
    "description": "Install Node.js, npm, git, and VS Code",
    "completed": true,
    "priority": "medium"
  }'
```

**Response:** `200 OK`
```json
{
  "id": 1,
  "title": "Updated environment setup",
  "description": "Install Node.js, npm, git, and VS Code",
  "completed": true,
  "priority": "medium",
  "createdAt": "2024-01-01T10:00:00.000Z"
}
```

**Error Responses:**

`404 Not Found` - Task does not exist:
```json
{
  "error": "Task not found"
}
```

`400 Bad Request` - Validation errors (same as POST)

### 6. Delete a Task
Delete a task by its ID.

**Endpoint:** `DELETE /tasks/:id`

**Example:**
```bash
curl -X DELETE http://localhost:3000/tasks/1
```

**Response:** `200 OK`
```json
{
  "message": "Task deleted successfully"
}
```

**Error Response:** `404 Not Found`
```json
{
  "error": "Task not found"
}
```

## Testing the API

### Running Tests

The project includes comprehensive tests using the `tap` testing framework.

**Run all tests:**
```bash
npm test
```

**Expected output:**
```
 PASS  test/server.test.js 134 OK

  🌈 TEST COMPLETE 🌈
```

### Manual Testing with cURL

Here's a complete workflow to test the API manually:

1. **Get all tasks:**
   ```bash
   curl http://localhost:3000/tasks
   ```

2. **Create a new task:**
   ```bash
   curl -X POST http://localhost:3000/tasks \
     -H "Content-Type: application/json" \
     -d '{
       "title": "Learn Express.js",
       "description": "Complete Express.js tutorial",
       "completed": false,
       "priority": "high"
     }'
   ```

3. **Get a specific task (replace 1 with actual task ID):**
   ```bash
   curl http://localhost:3000/tasks/1
   ```

4. **Update a task:**
   ```bash
   curl -X PUT http://localhost:3000/tasks/1 \
     -H "Content-Type: application/json" \
     -d '{
       "title": "Learn Express.js - Updated",
       "description": "Complete Express.js tutorial and build a project",
       "completed": true,
       "priority": "high"
     }'
   ```

5. **Get tasks by priority:**
   ```bash
   curl http://localhost:3000/tasks/priority/high
   ```

6. **Filter and sort tasks:**
   ```bash
   curl "http://localhost:3000/tasks?completed=false&sortBy=createdAt"
   ```

7. **Delete a task:**
   ```bash
   curl -X DELETE http://localhost:3000/tasks/1
   ```

### Testing with Postman

You can also use Postman or similar API testing tools:

1. Import the endpoints listed above
2. Set the base URL to `http://localhost:3000`
3. Use the request body examples for POST and PUT requests
4. Set `Content-Type: application/json` header for POST and PUT requests

## Project Structure

```
task-manager-api-pranav22kurup/
├── app.js              # Main application file with Express server and routes
├── task.json           # Initial task data
├── package.json        # Project dependencies and scripts
├── test/
│   └── server.test.js  # Test suite
└── README.md           # This file
```

## Features

- ✅ RESTful API design
- ✅ CRUD operations for tasks
- ✅ Task filtering by completion status
- ✅ Task sorting by creation date
- ✅ Priority levels (low, medium, high)
- ✅ Priority-based task filtering
- ✅ Input validation and error handling
- ✅ Comprehensive test suite
- ✅ No database required (uses JSON file for data storage)

## Technologies Used

- **Node.js**: JavaScript runtime
- **Express.js**: Web application framework
- **tap**: Testing framework
- **supertest**: HTTP assertion library for testing

## License

ISC

## Author

Airtribe
