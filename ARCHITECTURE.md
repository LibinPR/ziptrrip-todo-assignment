# Architecture

## Overview

The application is a full-stack Todo application built as a React Multiple Page Application (MPA), backed by a TypeScript/Express REST API and PostgreSQL.

The implementation keeps the architecture simple while maintaining clear separation between HTTP handling, business logic, persistence, and presentation.

---

# System Architecture

```text
┌─────────────────────────────────────────────────────────────────┐
│                           Browser                               │
│                                                                 │
│   ┌──────────────────┐              ┌────────────────────────┐  │
│   │    index.html    │              │       todo.html        │  │
│   │    Todo List     │              │     Todo Details       │  │
│   └────────┬─────────┘              └───────────┬────────────┘  │
│            │                                    │               │
│            ▼                                    ▼               │
│       main.tsx                            todo-main.tsx         │
│            │                                    │               │
│            └───────────────┬────────────────────┘               │
│                            ▼                                    │
│                         todoApi                                │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ HTTP / JSON
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                       Express REST API                         │
│                                                                 │
│     Routes → Validation → Controller → Service → Repository    │
│                                                       │         │
│                                                       ▼         │
│                                                 Prisma Client   │
└───────────────────────────────────────────────────────┬─────────┘
                                                        │
                                                        │ SQL
                                                        ▼
                                             ┌──────────────────┐
                                             │    PostgreSQL    │
                                             │      Todo        │
                                             └──────────────────┘
```

---

# Backend Architecture

The backend follows a layered architecture:

```text
HTTP Request
     │
     ▼
┌──────────────────────┐
│        Routes        │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ Validation Middleware│
│       Zod / ID       │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│      Controller      │
│   HTTP concerns      │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│       Service        │
│   Business logic     │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│      Repository      │
│   Data access        │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│    Prisma Client     │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│      PostgreSQL      │
└──────────────────────┘
```

## Routes

Routes define the HTTP contract and connect endpoints to middleware and controllers.

```text
GET    /api/v1/todos
GET    /api/v1/todos/:id
POST   /api/v1/todos
PATCH  /api/v1/todos/:id
DELETE /api/v1/todos/:id
```

Routes do not contain database queries or business logic.

---

## Validation Middleware

Validation occurs before controller execution.

Zod validates request bodies.

A separate middleware validates Todo IDs and ensures they are positive integers.

```text
Invalid Request
      │
      ▼
Validation Middleware
      │
      ├── Invalid → 400
      │
      └── Valid → Controller
```

---

## Controller Layer

Controllers handle HTTP-specific responsibilities:

- Reading request parameters
- Reading request bodies
- Calling services
- Selecting HTTP status codes
- Returning JSON responses
- Forwarding errors

Controllers do not directly access Prisma.

---

## Service Layer

The service layer contains application-level behavior.

For example, updating a Todo first verifies that the Todo exists:

```text
updateTodo(id)
     │
     ▼
findById(id)
     │
     ├── Not found → AppError(404)
     │
     └── Found → repository.update()
```

This keeps resource-existence rules outside the controller.

---

## Repository Layer

The repository is responsible for persistence operations.

Current operations include:

```text
findAll()
findById()
create()
update()
delete()
```

The repository communicates with PostgreSQL through Prisma.

This also makes the service layer easier to unit test because repository dependencies can be mocked.

---

# Error Handling

Application errors are represented using `AppError`.

Errors are forwarded to centralized Express error middleware.

```text
Controller / Service
        │
        │ error
        ▼
┌─────────────────────┐
│  Error Middleware   │
└──────────┬──────────┘
           │
           ├── AppError
           │      ↓
           │   Known status
           │
           └── Unknown error
                  ↓
                 500
```

This keeps API error responses consistent.

---

# Database Architecture

PostgreSQL is used as the application's persistent data store.

The Todo model contains:

```text
Todo
├── id
├── title
├── description
├── completed
├── priority
├── dueDate
├── createdAt
└── updatedAt
```

Indexes are currently defined for:

```text
completed
priority
```

These fields are natural candidates for filtering as the application grows.

Database schema changes are managed through Prisma migrations.

---

# Frontend Architecture

The assignment requires a **Multiple Page Application (MPA)** rather than a Single Page Application.

The implementation therefore uses two HTML entry points:

```text
frontend/
│
├── index.html
│      │
│      ▼
│   main.tsx
│      │
│      ▼
│   TodoList
│
└── todo.html
       │
       ▼
    todo-main.tsx
       │
       ▼
    TodoDetails
```

There is intentionally no React Router.

The Todo details page receives the Todo ID through a query parameter:

```text
/todo.html?id=1
```

This directly satisfies the MPA requirement while keeping the routing model simple.

---

# Frontend Data Flow

```text
User Interaction
      │
      ▼
React Component
      │
      ▼
todoApi.ts
      │
      │ HTTP
      ▼
Express REST API
      │
      ▼
PostgreSQL
      │
      │ JSON
      ▼
todoApi.ts
      │
      ▼
React State
      │
      ▼
Updated UI
```

---

# Todo Details Flow

The details page reads the Todo ID from the query string.

```text
/todo.html?id=42
       │
       ▼
Read URLSearchParams
       │
       ▼
Extract id = 42
       │
       ▼
GET /api/v1/todos/42
       │
       ▼
Display Todo
```

---

# Overdue Date Handling

The application does not persist an `isOverdue` field in PostgreSQL.

Instead, overdue status is derived from the Todo's existing `dueDate` and `completed` state.

```text
                Todo
                  │
          ┌───────┴────────┐
          │                │
       completed?        incomplete
          │                │
          ▼                ▼
      Completed        compare dueDate
                           │
                  ┌────────┼────────┐
                  │        │        │
                past     today    future
                  │        │        │
                  ▼        ▼        ▼
               Overdue  Due today  Due date
```

This avoids storing time-dependent derived state in the database.

Expected presentation:

```text
Past date + incomplete → Overdue
Today + incomplete     → Due today
Tomorrow + incomplete  → Due tomorrow
Future + incomplete    → Due <date>
Any date + completed   → Completed <date>
```

---

# Project Structure

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
│   └── tests/
│       ├── integration/
│       └── services/
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
├── docs/
│   ├── API.md
│   ├── ARCHITECTURE.md
│   ├── DESIGN_DECISIONS.md
│   └── TESTING.md
│
├── postman/
│   └── Ziptrrip-Todo.postman_collection.json
│
└── README.md
```

---

# Design Goals

The implementation focuses on:

1. Clear separation of responsibilities
2. Type safety through TypeScript
3. Persistent PostgreSQL storage
4. Input validation
5. Consistent API responses
6. Testable backend components
7. Explicit MPA implementation
8. Simple local development
9. A focused feature set without unnecessary infrastructure

The architecture intentionally avoids introducing systems such as Redis, message queues, authentication, or Docker because they are not required for this assignment.
