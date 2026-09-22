# Design Decisions

This document explains the main technical decisions made while implementing the application.

---

## 1. TypeScript

TypeScript is used across both frontend and backend.

### Why

- Compile-time type checking
- Better IDE support
- Safer API and domain models
- Easier maintenance as the application grows

TypeScript is also listed as an additional consideration in the assignment.

---

## 2. PostgreSQL + Prisma

PostgreSQL was selected as the persistent database and Prisma as the ORM.

### Why PostgreSQL

The Todo domain contains structured relational data and does not require a document-oriented database.

PostgreSQL provides:

- Strong data consistency
- Structured schema
- Indexing
- Mature transaction support
- Good TypeScript ecosystem support

### Why Prisma

Prisma provides:

- Type-safe database access
- Schema-driven development
- Migration support
- Good integration with TypeScript

---

## 3. Layered Backend Architecture

The backend separates:

```text
Controller
    ↓
Service
    ↓
Repository
    ↓
Database
```

### Why

This prevents HTTP handling and database access from becoming tightly coupled.

For example, a controller does not need to know how a Todo is stored in PostgreSQL.

The repository can also be mocked during unit testing without changing controller behavior.

---

## 4. PATCH Instead of PUT

Todo updates use:

```http
PATCH /api/v1/todos/:id
```

because the UI frequently changes individual properties such as:

- Completion status
- Priority
- Title
- Due date

PATCH naturally represents these partial updates.

Fields that are omitted remain unchanged.

Nullable fields such as `dueDate` can explicitly be cleared using:

```json
{
  "dueDate": null
}
```

This gives the API a clear distinction:

```text
Field omitted → do not modify
Field = null   → explicitly clear
```

---

## 5. Centralized Validation

Request validation is handled through middleware rather than inside controllers.

```text
Request
   │
   ▼
Validation
   │
   ▼
Controller
```

This ensures invalid input is rejected consistently and keeps controller methods focused on application behavior.

Zod is used for body validation.

---

## 6. Centralized Error Handling

Errors are forwarded to a single Express error middleware.

This avoids repeating error response formatting throughout every controller method.

It also provides a consistent API contract for clients.

---

## 7. Multiple Page Application

The frontend intentionally does not use React Router.

The application has two HTML entry points:

```text
index.html
todo.html
```

The Todo details page receives the ID through:

```text
/todo.html?id=<todoId>
```

This directly satisfies the assignment's requirement for a Multiple Page Application.

It also avoids introducing routing infrastructure that is unnecessary for this application's scope.

---

## 8. Database Indexes

Indexes were added for:

```text
completed
priority
```

These fields are natural candidates for filtering Todo records.

Although the current dataset is small, defining the indexes at the database layer provides a straightforward path for maintaining query performance as the dataset grows.

---

## 9. Derived Overdue State

The application does not store an `isOverdue` boolean in the database.

Overdue status is derived from:

```text
dueDate
completed
current date
```

### Why

Overdue status is time-dependent.

A Todo that is not overdue today may become overdue tomorrow without any database update.

Persisting `isOverdue` would therefore introduce stale derived state.

Instead, the UI derives the presentation state when rendering the Todo.

Example:

```text
Past due date + incomplete → Overdue
Today + incomplete         → Due today
Tomorrow + incomplete      → Due tomorrow
Future + incomplete        → Due <date>
Any date + completed       → Completed <date>
```

The completed state takes precedence over overdue status.

---

## 10. Testing Strategy

The backend uses two levels of automated testing.

### Unit tests

Service-layer behavior is tested independently using mocked repository dependencies.

This allows business behavior to be tested without requiring HTTP or database access.

### Integration tests

API tests run against the actual Express application and PostgreSQL database.

This verifies the complete request path:

```text
HTTP Request
    ↓
Express
    ↓
Validation
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

The combination provides both isolated unit coverage and confidence in the real API/database integration.

---

## 11. API Contract

The API uses a consistent response structure:

```json
{
  "success": true,
  "data": {}
}
```

and:

```json
{
  "success": false,
  "message": "Error message"
}
```

### Why

A predictable response shape makes the API easier for the frontend and other clients to consume.

Validation errors additionally expose field-level information so clients can provide useful feedback.

---

## 12. HTTP Status Codes

The API uses standard HTTP semantics:

```text
200 → Successful read/update
201 → Resource created
204 → Resource deleted
400 → Invalid request
404 → Resource not found
500 → Unexpected server error
```

This avoids encoding operation results only inside JSON messages.

---

## 13. Scope Management

The application intentionally does not introduce authentication, Redis, message queues, Docker, or other infrastructure that is not required by the assignment.

The implementation instead focuses on delivering the required functionality with clean engineering fundamentals:

- TypeScript
- REST APIs
- PostgreSQL
- Prisma
- Layered architecture
- Validation
- Error handling
- Automated tests
- Postman collection
- MPA frontend
- Responsive UI

The objective was to demonstrate sound engineering decisions without adding complexity that does not provide meaningful value for this application's scope.
