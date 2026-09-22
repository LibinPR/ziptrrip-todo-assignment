# Testing

## Overview

The backend uses automated unit and integration tests with Jest.

The test suite is designed to verify both isolated service behavior and the real API flow against PostgreSQL.

---

## Test Stack

- Jest
- ts-jest
- Supertest
- PostgreSQL
- Prisma

---

# Unit Tests

Service-layer behavior is tested independently from the database.

Repository dependencies are mocked so the tests focus on application behavior.

The service tests cover:

- Returning all todos
- Returning a todo by ID
- Handling a missing todo
- Creating a todo
- Updating an existing todo
- Handling update of a missing todo
- Deleting a todo
- Handling deletion of a missing todo

This keeps the unit tests fast and focused.

---

# Integration Tests

API integration tests use:

- The actual Express application
- Supertest
- The actual Prisma client
- The local PostgreSQL database

The tests exercise the full request path:

```text
HTTP Request
    ↓
Express
    ↓
Route
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

---

# Current Test Coverage

The integration suite covers:

1. Health check
2. Todo creation
3. Invalid todo creation
4. Todo listing
5. Get todo by ID
6. Invalid todo ID
7. Todo not found
8. Partial todo update
9. Clearing a due date
10. Empty PATCH validation
11. Todo deletion

The service unit suite contains 8 tests.

The complete test suite currently contains:

```text
2 test suites
19 tests
```

Expected result:

```text
Test Suites: 2 passed, 2 total
Tests:       19 passed, 19 total
```

---

# Database Isolation

Integration tests clean up Todo records before each test so individual test cases do not depend on data left by previous tests.

The test suite also disconnects Prisma after completion.

This keeps the test environment predictable and avoids leaving open database connections.

---

# Running Tests

From the backend directory:

```bash
npm test
```

For deterministic single-process execution:

```bash
npm test -- --runInBand
```

---

# Build Verification

Backend TypeScript compilation:

```bash
npm run build
```

Frontend production build:

```bash
cd ../frontend
npm run build
```

A successful production build verifies that the TypeScript code compiles and the frontend can be bundled for deployment.

---

# Manual API Testing

A Postman collection is included with the repository:

```text
postman/Ziptrrip-Todo.postman_collection.json
```

It covers the main API flows and validation/error scenarios.

The collection includes:

- Health check
- Create todo
- List todos
- Get todo
- Update todo
- Mark complete
- Clear due date
- Delete todo
- Invalid payload
- Invalid ID
- Empty PATCH
- Not-found case

---

# Frontend Verification

The frontend should also be manually checked for:

- Todo creation
- Todo editing
- Todo deletion
- Completion toggle
- Search
- All / Active / Completed filters
- Priority display
- Due-date display
- Overdue display
- Todo details page
- Query-parameter based navigation
- Loading states
- Delete confirmation
- Responsive layout

---

# Date State Verification

Due-date presentation is derived from the current date.

The following cases should be verified manually:

| Todo state | Expected display |
|---|---|
| No due date | No date indicator |
| Past + incomplete | Overdue |
| Today + incomplete | Due today |
| Tomorrow + incomplete | Due tomorrow |
| Future + incomplete | Due date |
| Past + completed | Completed date |
| Today + completed | Completed date |
| Future + completed | Completed date |

Completed status takes precedence over overdue status.

---

# Test Philosophy

The test strategy intentionally balances coverage and scope.

Unit tests verify business behavior in isolation.

Integration tests verify that the real HTTP, validation, service, repository, Prisma, and PostgreSQL layers work together.

Postman provides an additional manual/API-client verification path.

Together these provide confidence in both individual components and the complete application flow.
