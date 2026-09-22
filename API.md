# API Documentation

## Base URL

```text
http://localhost:5000/api/v1
```

Health check:

```text
GET http://localhost:5000/health
```

---

## Response Format

Successful responses use:

```json
{
  "success": true,
  "data": {}
}
```

Validation and application errors use:

```json
{
  "success": false,
  "message": "Error message"
}
```

Validation errors additionally include field-level details:

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "title",
      "message": "Title is required"
    }
  ]
}
```

---

# Health Check

## GET `/health`

Returns the current API status.

### Response

**200 OK**

```json
{
  "status": "ok",
  "message": "Ziptrrip Todo API is running"
}
```

---

# Todo APIs

## GET `/todos`

Returns all todos ordered by creation time, newest first.

### Response

**200 OK**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Prepare interview",
      "description": "Revise backend concepts",
      "completed": false,
      "priority": "HIGH",
      "dueDate": "2026-09-25T12:00:00.000Z",
      "createdAt": "2026-09-22T08:00:00.000Z",
      "updatedAt": "2026-09-22T08:00:00.000Z"
    }
  ]
}
```

---

## GET `/todos/:id`

Returns a single todo by ID.

### Example

```text
GET /api/v1/todos/1
```

### Response

**200 OK**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Prepare interview",
    "description": "Revise backend concepts",
    "completed": false,
    "priority": "HIGH",
    "dueDate": "2026-09-25T12:00:00.000Z",
    "createdAt": "2026-09-22T08:00:00.000Z",
    "updatedAt": "2026-09-22T08:00:00.000Z"
  }
}
```

### Invalid ID

**400 Bad Request**

```json
{
  "success": false,
  "message": "Invalid todo ID"
}
```

### Todo not found

**404 Not Found**

```json
{
  "success": false,
  "message": "Todo not found"
}
```

---

# POST `/todos`

Creates a new todo.

### Request

```json
{
  "title": "Prepare interview",
  "description": "Revise Node.js and system design",
  "priority": "HIGH",
  "dueDate": "2026-09-25T12:00:00.000Z"
}
```

### Fields

| Field | Type | Required | Description |
|---|---|---:|---|
| `title` | string | Yes | Todo title |
| `description` | string | No | Additional details |
| `completed` | boolean | No | Completion state |
| `priority` | `LOW \| MEDIUM \| HIGH` | No | Todo priority |
| `dueDate` | ISO datetime | No | Optional due date |

Defaults:

- `completed` → `false`
- `priority` → `MEDIUM`

### Response

**201 Created**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Prepare interview",
    "description": "Revise Node.js and system design",
    "completed": false,
    "priority": "HIGH",
    "dueDate": "2026-09-25T12:00:00.000Z",
    "createdAt": "2026-09-22T08:00:00.000Z",
    "updatedAt": "2026-09-22T08:00:00.000Z"
  }
}
```

---

# PATCH `/todos/:id`

Updates an existing todo.

The endpoint uses **partial-update semantics**.

Only fields supplied in the request body are changed. Fields that are omitted remain unchanged.

### Example

```json
{
  "title": "Prepare backend interview",
  "priority": "HIGH"
}
```

Only `title` and `priority` are modified.

The existing `description`, `completed`, and `dueDate` values remain unchanged.

---

## Clearing a nullable field

`dueDate` can be explicitly cleared using `null`.

```json
{
  "dueDate": null
}
```

This removes the existing due date.

By contrast, omitting `dueDate` means its current value remains unchanged.

```json
{
  "title": "Prepare backend interview"
}
```

---

## Empty PATCH

An empty update object is rejected.

```json
{}
```

### Response

**400 Bad Request**

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "",
      "message": "At least one field must be provided for update"
    }
  ]
}
```

---

## Supported PATCH fields

| Field | Type | Description |
|---|---|---|
| `title` | string | Updated todo title |
| `description` | string | Updated description |
| `completed` | boolean | Completion state |
| `priority` | `LOW \| MEDIUM \| HIGH` | Todo priority |
| `dueDate` | ISO datetime \| `null` | Updated due date; `null` clears it |

### Response

**200 OK**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Prepare backend interview",
    "description": "Revise Node.js and system design",
    "completed": false,
    "priority": "HIGH",
    "dueDate": null,
    "createdAt": "2026-09-22T08:00:00.000Z",
    "updatedAt": "2026-09-22T09:00:00.000Z"
  }
}
```

---

# DELETE `/todos/:id`

Deletes a todo.

### Response

**204 No Content**

The response contains no body.

### Todo not found

**404 Not Found**

```json
{
  "success": false,
  "message": "Todo not found"
}
```

---

# Validation Rules

Request validation is performed before controller logic using Zod.

## Title

- Required when creating a todo
- Leading/trailing whitespace is trimmed
- Cannot be empty
- Maximum length: 200 characters

## Description

- Optional
- Leading/trailing whitespace is trimmed
- Maximum length: 1000 characters

## Priority

Must be one of:

```text
LOW
MEDIUM
HIGH
```

## Due Date

When provided, `dueDate` must be a valid ISO datetime.

During updates, `null` can be used to clear the existing due date.

## Todo ID

Todo IDs must be positive integers.

```text
1       → valid
25      → valid
0       → invalid
-1      → invalid
abc     → invalid
```

---

# HTTP Status Codes

| Status | Meaning |
|---:|---|
| `200` | Successful GET or PATCH |
| `201` | Todo successfully created |
| `204` | Todo successfully deleted |
| `400` | Invalid request or validation failure |
| `404` | Todo/resource not found |
| `500` | Unexpected server error |

---

# Postman Collection

A ready-to-import Postman collection is included at:

```text
postman/Ziptrrip-Todo.postman_collection.json
```

The collection covers:

- Health check
- Get all todos
- Create todo
- Get todo by ID
- Update todo
- Mark todo complete
- Clear due date
- Delete todo
- Invalid payload
- Invalid todo ID
- Empty PATCH
- Todo not found

The create request automatically stores the created todo ID in the collection variable used by subsequent requests.
