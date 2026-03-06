# API Documentation

Base URL (Local): http://localhost:4000/api

Content-Type:

- Request/Response: `application/json`

## Conventions

### Status mapping

- `people.status`: `0=active`, `1=inactive`
- `sessions.status`: `0=scheduled`, `1=completed`, `2=cancelled`

### Computed fields

- `lastSession` is derived from `sessions` (MAX(start_at)) and is NOT stored in `people`.

---

# Auth

## POST /api/auth/login

Purpose:

- User login. Returns a JWT token for accessing protected APIs.

Auth:

- None

Query params:

- None

Request body:

```json
{
  "email": "user@example.com",
  "password": "plaintext password"
}
```

Response fields:

ok: boolean
token: string (JWT)
user.id: number
user.email: string

Errors:

400: email/password required
401: Invalid credentials
403: Account disabled
500: Internal server error

Notes:

Store token on the frontend (e.g., localStorage).

For protected APIs, include this header in every request:

Authorization: Bearer <token>

# People

## GET /api/people

Purpose:

- Get a list of patients (role=0) with their last session date.

Auth:

- None

Query params:

- None (for now)

Request body:

- None

Response 200:

```json
[
  {
    "id": 1,
    "name": "John Doe",
    "email": "john.doe@example.com",
    "phone": "1234567890",
    "status": "Active",
    "lastSession": "2024-01-15",
    "notes": "not come for sessions for a long time"
  }
]
```

Response fields:

id: number

name: string

email: string | null

phone: string | null

status: "Active" | "Inactive"

lastSession: "YYYY-MM-DD" | null

notes: string | null

Errors:

500: Database error

# Sessions

## GET /api/sessions

Purpose:

- Get a list of sessions with patient/staff names (joined from `people`).

Auth:

- None

Query params:

- None (for now)

Request body:

- None

Response 200:

```json
[
  {
    "id": 1,
    "title": "Regular Meet",
    "patientName": "John Doe",
    "staff": "Dr Smith",
    "status": "Scheduled",
    "date": "2024-01-15",
    "time": "02:00",
    "duration": "60m"
  }
]
```

Response fields:

id: number

title: string

patientName: string

staff: string

status: "Scheduled" | "Completed" | "Cancelled"

date: "YYYY-MM-DD"

time: "HH:mm"

duration: string | null // e.g. "30m"

Errors:

500: Database error

# Dashboard

## GET /api/dashboard/summary

Purpose:

- Get dashboard summary counts for the four top cards:
  - Today's scheduled sessions
  - Upcoming scheduled sessions (next 7 days)
  - Completed sessions (this month)
  - Active people

Auth:

- None

Query params:

- None

Request body:

- None

Response 200:

```json
{
  "today_count": 3,
  "upcoming_count": 7,
  "completed_count": 2,
  "active_people": 3
}
```

Response fields:

today_count: number

upcoming_count: number

completed_count: number

active_people: number

Errors:

500: Database error
