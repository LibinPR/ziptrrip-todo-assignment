# Ziptrrip Todo Application

A full-stack Todo application built as part of the Ziptrrip Backend Engineer take-home assignment.

The project uses a TypeScript/Express backend with PostgreSQL and Prisma, along with a React frontend implemented as a Multi-Page Application (MPA).

## Features

### Todo Management

- Create todos
- View all todos
- View a single todo
- Update todos
- Mark todos as completed/incomplete
- Delete todos
- Set priority: Low, Medium, High
- Set and clear due dates
- Automatic created/updated timestamps

### Frontend

- React + TypeScript
- Multi-Page Application (MPA)
- Todo list page
- Individual todo details page
- Search todos
- Filter by All / Active / Completed
- Active and completed todo counts
- Priority indicators
- Due-date status indicators
- Loading skeletons
- Delete confirmation dialog
- Responsive layout
- Accessible interactive controls

### Backend

- RESTful CRUD APIs
- TypeScript
- Express.js
- PostgreSQL
- Prisma ORM
- Zod request validation
- Layered Repository → Service → Controller architecture
- Centralized error handling
- Input validation
- Appropriate HTTP status codes
- Unit tests
- Integration/API tests
- Postman collection

## Tech Stack

### Frontend

- React
- TypeScript
- Vite
- Lucide React

### Backend

- Node.js
- Express.js
- TypeScript
- Prisma ORM
- PostgreSQL
- Zod
- Jest
- Supertest

## Getting Started

### Prerequisites

Make sure the following are installed:

- Node.js 20+
- npm
- PostgreSQL

### 1. Clone the repository

```bash
git clone <repository-url>
cd ziptrrip-todo-assignment
```

### 2. Configure the backend

Create a `.env` file inside the `backend/` directory:

```env
DATABASE_URL="postgresql://USERNAME:PASSWORD@localhost:5432/ziptrrip_todo"
PORT=5000
```

Replace `USERNAME` and `PASSWORD` with your local PostgreSQL credentials.

Make sure the PostgreSQL database `ziptrrip_todo` exists.

### 3. Install backend dependencies

From the project root:

```bash
cd backend
npm install
```

### 4. Set up the database

Run the Prisma migrations and generate the Prisma client:

```bash
npx prisma migrate dev
npx prisma generate
```

### 5. Start the backend

For development:

```bash
npm run dev
```

The backend will run at:

```text
http://localhost:5000
```

Health check:

```text
http://localhost:5000/health
```

Keep this terminal running.

### 6. Install frontend dependencies

Open a second terminal and return to the project root:

```bash
cd frontend
npm install
```

### 7. Start the frontend

```bash
npm run dev
```

Vite will print the local frontend URL in the terminal, typically:

```text
http://localhost:5173/
```

The application has two separate pages:

```text
Todo List:
http://localhost:5173/

Todo Details:
http://localhost:5173/todo.html?id=<todoId>
```

The exact frontend port is the one displayed by Vite when the development server starts.

The application intentionally uses multiple HTML entry points instead of a client-side router to satisfy the MPA requirement.

### 8. Run the tests

Open another terminal:

```bash
cd backend
npm test
```

The backend includes service unit tests and API integration tests.

Current test suite:

```text
Test Suites: 2 passed, 2 total
Tests:       19 passed, 19 total
```

### 9. Build for production

Backend:

```bash
cd backend
npm run build
```

Frontend:

```bash
cd frontend
npm run build
```

The frontend production build generates both MPA entry points:

```text
dist/index.html
dist/todo.html
```

## Postman

The Postman collection is available at:

```text
postman/Ziptrrip-Todo.postman_collection.json
```

Import the collection into Postman and make sure the backend is running on:

```text
http://localhost:5000
```

The collection includes CRUD requests along with validation and error scenarios.

## Project Structure

```text
ziptrrip-todo-assignment/
│
├── backend/
│   ├── prisma/
│   │   ├── migrations/
│   │   └── schema.prisma
│   │
│   ├── src/
│   │   ├── controllers/
│   │   ├── lib/
│   │   ├── middleware/
│   │   ├── repositories/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── validators/
│   │   ├── app.ts
│   │   └── server.ts
│   │
│   ├── tests/
│   │   ├── integration/
│   │   └── services/
│   │
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── types/
│   │   ├── main.tsx
│   │   └── todo-main.tsx
│   │
│   ├── index.html
│   └── todo.html
│
├── postman/
│   └── Ziptrrip-Todo.postman_collection.json
│
├── API.md
├── ARCHITECTURE.md
├── DESIGN_DECISIONS.md
├── README.md
└── TESTING.md
```

## Architecture

The backend follows a layered architecture:

```text
HTTP Request
     ↓
Routes
     ↓
Validation Middleware
     ↓
Controller
     ↓
Service
     ↓
Repository
     ↓
Prisma
     ↓
PostgreSQL
```

### Responsibilities

**Routes**

Define HTTP endpoints and middleware composition.

**Validation**

Validates request bodies and route parameters before they reach business logic.

**Controllers**

Handle HTTP-specific concerns such as request/response handling and status codes.

**Services**

Contain application/business logic and resource existence checks.

**Repositories**

Encapsulate database operations through Prisma.

**Prisma**

Provides type-safe database access to PostgreSQL.

## API

Base URL:

```text
http://localhost:5000/api/v1
```

### Health Check

```http
GET /health
```

### Todos

```http
GET    /todos
GET    /todos/:id
POST   /todos
PATCH  /todos/:id
DELETE /todos/:id
```

Example create request:

```json
{
  "title": "Complete assignment",
  "description": "Finish the Ziptrrip take-home assignment",
  "priority": "HIGH",
  "dueDate": "2026-09-22T12:00:00.000Z"
}
```

The complete API documentation is available in [API.md](./API.md).

## Database

PostgreSQL is used as the persistent datastore.

The `Todo` model contains:

- `id`
- `title`
- `description`
- `completed`
- `priority`
- `dueDate`
- `createdAt`
- `updatedAt`

Indexes are provided for commonly filtered fields such as completion status and priority.

Database migrations are managed using Prisma.

## Validation & Error Handling

Request validation is handled using Zod.

Invalid requests return structured `400 Bad Request` responses.

Resource lookup failures return `404 Not Found`.

Invalid route parameters are rejected before reaching the service layer.

Unhandled application errors are processed through centralized error middleware.

## Testing

The backend contains both unit and integration/API tests.

Run the test suite:

```bash
cd backend
npm test
```

The integration tests cover:

- Health endpoint
- Todo creation
- Invalid input
- Todo listing
- Todo retrieval
- Invalid IDs
- Missing todos
- Partial updates
- Clearing due dates
- Empty updates
- Todo deletion

The service tests cover business logic independently from HTTP concerns.

See [TESTING.md](./TESTING.md) for more details.

## Additional Documentation

- [API Documentation](./API.md)
- [Architecture](./ARCHITECTURE.md)
- [Design Decisions](./DESIGN_DECISIONS.md)
- [Testing](./TESTING.md)

## Environment & Security

The `.env` file is local configuration and must not be committed to the repository.

Use the provided environment variable structure:

```env
DATABASE_URL="postgresql://USERNAME:PASSWORD@localhost:5432/ziptrrip_todo"
PORT=5000
```
