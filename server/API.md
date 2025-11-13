# API Documentation

This document describes all HTTP routes exposed by the server, grouped by authentication requirement, followed by detailed specifications for each route including request, response, and error cases.

## Route index (grouped by authentication)

List of available endpoints:

- GET `/` — server health check
- GET `/books` — list books with pagination
- GET `/books/:id` — get a single book detail (auto-generates/stores AI summary when missing)
- POST `/register` — create a new user
- POST `/login` — login with email/password
- POST `/login/google` — login with Google (Google Identity ID token)

Routes below need authentication (require `Authorization: Bearer <JWT>`):

- GET `/mylist` — get current user’s reading list (MyList)
- POST `/mylist/:id` — add a Book (by BookId in `:id`) to current user’s MyList

> The request user should be an user owner

- PATCH `/mylist/:id` — update note on a MyList item (by MyList.id)
- DELETE `/mylist/:id` — remove a MyList item (by MyList.id)

---

## Conventions

- Authentication header: `Authorization: Bearer <access_token>`
- Content type: `application/json`
- Pagination query: `page` (1-based), `limit` (default 10)

---

## Public routes

### GET `/`

Health check.

Response 200:

```
{
  "message": "Server is running"
}
```

Possible errors:

- 500 Internal Server Error

---

### GET `/books`

List books with pagination.

Query params:

- `page` (optional, number, default 1)
- `limit` (optional, number, default 10)

Response 200:

```
{
  "data": [
    {
      "id": 1,
      "title": "...",
      "author": "...",
      "coverUrl": "...",
      "description": "...",
      "aiSummary": "...",
      "category": "..."
    }
  ],
  "meta": {
    "total": 123,
    "page": 1,
    "perPage": 10,
    "totalPages": 13
  }
}
```

Possible errors:

- 500 Internal Server Error (database failure)

---

### GET `/books/:id`

Get detail for a single book. If the book has no `aiSummary`, the server will generate one via OpenAI and persist it.

Path params:

- `id` (Book.id)

Response 200:

```
{
  "id": 1,
  "title": "...",
  "author": "...",
  "coverUrl": "...",
  "description": "...",
  "aiSummary": "...",
  "category": "..."
}
```

Possible errors:

- 404 Not Found — when the Book does not exist
- 500 Internal Server Error — OpenAI or persistence failure

---

### POST `/register`

Create a new user.

Body:

```
{
  "userName": "yourname",
  "email": "you@example.com",
  "password": "plaintext"
}
```

Response 201:

```
{
  "message": "Add User Success",
  "data": { "id": 1, "email": "you@example.com" }
}
```

Possible errors:

- 400 Bad Request — Sequelize validation errors (returned as array of messages)
- 500 Internal Server Error

---

### POST `/login`

Login with email/password.

Body:

```
{
  "email": "you@example.com",
  "password": "plaintext"
}
```

Response 200:

```
{
  "message": "Login Success",
  "access_token": "<JWT>"
}
```

Possible errors:

- 400 Bad Request — `email` or `password` missing
- 401 UnathorizedError — invalid email/password
- 500 Internal Server Error

---

### POST `/login/google`

Login with Google Identity. The server verifies the ID token and issues a JWT. If the user does not exist, it will be auto-created.

Body:

```
{
  "googleAccessToken": "<Google ID token>"
}
```

Response 200:

```
{
  "access_token": "<JWT>"
}
```

Possible errors:

- 500 Internal Server Error — verification failed or other error

---

## Authenticated routes

All the following routes require:

- Header: `Authorization: Bearer <JWT>`

Common authentication/authorization errors:

- 401 UnathorizedError — missing/invalid token
- 403 ForbiddenError — ownership check failed (for MyList item routes guarded by `onlyUser`)

### GET `/mylist`

Get the current user’s MyList items. Each item includes its associated Book (depending on model include settings).

Response 200:

```
[
  {
    "id": 10,
    "UserId": 1,
    "BookId": 2,
    "note": "...",
    "Book": { "id": 2, "title": "...", "author": "...", ... }
  }
]
```

Possible errors:

- 401 UnathorizedError — invalid token
- 500 Internal Server Error

---

### POST `/mylist/:id`

Add a book to the user’s MyList by BookId (provided in route param `:id`).

Path params:

- `id` (Book.id)

Response 201 (created):

```
{
  "message": "Added to MyList",
  "data": { "id": 11, "UserId": 1, "BookId": 3, "note": null }
}
```

If already exists (duplicate):
Response 200:

```
{
  "message": "Already in MyList",
  "data": { "id": 10, "UserId": 1, "BookId": 3, "note": null }
}
```

Possible errors:

- 400 BadRequest — `:id` missing/invalid
- 401 UnathorizedError — invalid token
- 404 NotFound — Book not found
- 500 Internal Server Error

---

### PATCH `/mylist/:id`

Update a note on a MyList item. The `:id` here is the MyList primary key (not BookId). Route is protected by `onlyUser` ownership check.

Path params:

- `id` (MyList.id)

Body:

```
{ "note": "your note" }
```

Response 200:

```
{
  "message": "Updated",
  "data": { "id": 5, "UserId": 1, "BookId": 2, "note": "your note" }
}
```

Possible errors:

- 401 UnathorizedError — invalid token
- 403 ForbiddenError — item owned by another user
- 404 NotFound — MyList item not found
- 500 Internal Server Error

---

### DELETE `/mylist/:id`

Delete a MyList item. The `:id` is the MyList primary key. Route is protected by `onlyUser` ownership check.

Path params:

- `id` (MyList.id)

Response 200:

```
{ "message": "Removed from MyList" }
```

Possible errors:

- 401 UnathorizedError — invalid token
- 403 ForbiddenError — item owned by another user
- 404 NotFound — MyList item not found
- 500 Internal Server Error

---

## Error format summary

The error handler returns consistent JSON structures:

- 400 BadRequest

```
{ "message": "<error message>" }
```

- 400 Sequelize validation/unique

```
{ "message": ["msg1", "msg2", ...] }
```

- 401 UnathorizedError

```
{ "message": "Invalid token" }
```

(or other message provided by the middleware/controller)

- 403 ForbiddenError

```
{ "message": "Bukan pengguna yang bisa akses" }
```

- 404 NotFound

```
{ "message": "<not found message>" }
```

- 500 Internal Server Error

```
{ "message": "Internal server error" }
```

---

## Notes

- JWTs are signed with `process.env.JWT_CODE`.
- Google login uses `process.env.GOOGLE_CLIENT_ID` to validate ID tokens.
- AI summaries are generated via OpenAI (`process.env.OpenAI_API_KEY`) and stored in the `Book.aiSummary` field.
