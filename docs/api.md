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

## GET /api/auth/me

Purpose:

- Get the current authenticated user's email.

Auth:

- Required

Query params:

- None

Request body:

- None

Response 200:

```json
{
  "email": "user@example.com"
}
```

Response fields:

email: string

Errors:

500: Internal server error

## PUT /api/auth/change-password

Purpose:

- Change the current authenticated user's password.

Auth:

- Required

Query params:

- None

Request body:

```json
{
  "currentPassword": "oldpassword123",
  "newPassword": "newpassword456"
}
```

Request body fields:

currentPassword: string (required)

newPassword: string (required)

Response 200:

```
{
  "ok": true,
  "message": "Password changed successfully"
}
```

Response fields:

ok: boolean

message: string

Errors:

400: currentPassword and newPassword are required

400: New password must be at least 6 characters

401: Current password is incorrect

403: Account disabled

404: User not found

500: Internal server error

# People

## GET /api/people

Purpose:

- Get a paginated list of patients (`role=0`) with their last past session date.

Auth:

- None

Query params:

- `page`: number, optional, default = `1`
- `limit`: number, optional, default = `5`

Request body:

- None

Response 200:

```json
{
  "data": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john.doe@example.com",
      "phone": "1234567890",
      "status": "Active",
      "lastSession": "2024-01-15",
      "notes": "not come for sessions for a long time"
    }
  ],
  "page": 1,
  "limit": 5,
  "total": 12,
  "totalPages": 3
}
```

Response fields:

data: array of patient objects

Patient object fields:

id: number

name: string

email: string | null

phone: string | null

status: "Active" | "Inactive"

lastSession: "YYYY-MM-DD" | null

notes: string | null

Pagination fields:

page: number

limit: number

total: number

totalPages: number

Errors:

500: Database error

## GET /api/people/patients/options

Purpose:

- Get all patient ids and names for select/dropdown options.
- Only returns people with `role=0`.

Auth:

- None

Query params:

- None

Request body:

- None

Response 200:

```json
[
  {
    "id": 1,
    "name": "John Doe"
  },
  {
    "id": 2,
    "name": "Jane Smith"
  }
]
```

Response fields:

id: number

name: string

Errors:

500: Internal server error

## GET /api/people/staff/options

Purpose:

- Get all staff ids and names for select/dropdown options.
- Only returns people with `role=1`.

Auth:

- None

Query params:

- None

Request body:

- None

Response 200:

```json
[
  {
    "id": 10,
    "name": "Dr Smith"
  },
  {
    "id": 11,
    "name": "Dr Brown"
  }
]
```

Response fields:

id: number

name: string

Errors:

500: Internal server error

## GET /api/people

Purpose:

- Get a paginated list of people.
- Support filtering by role and searching by name, email, or phone.
- Support filtering by person status.
- Support sorting by person name.
- Return frontend-friendly people fields.
- Return each person's last past session date.

Auth:

- None

Query params:

- `role`: string, optional, default = `patient`
- `search`: string, optional, default = `""`
- `page`: number, optional, default = `1`
- `limit`: number, optional, default = `5`
- `filterStatus`: number, optional, people status filter
- `filterName`: string, optional, sort by name:
  - `desc` = descending
  - any other value or omitted = ascending

Request body:

- None

Response 200:

```json
{
  "data": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john.doe@example.com",
      "phone": "1234567890",
      "status": "Active",
      "lastSession": "2024-01-15",
      "notes": "not come for sessions for a long time"
    }
  ],
  "page": 1,
  "limit": 5,
  "total": 20,
  "totalPages": 4
}
```

Response fields:

data: array

data[].id: number

data[].name: string

data[].email: string | null

data[].phone: string | null

data[].status: "Active" | "Inactive"

data[].lastSession: "YYYY-MM-DD" | null

data[].notes: string | null

page: number

limit: number

total: number

totalPages: number

Errors:

400: Invalid role

500: Internal server error

## POST /api/people/add-patient

Purpose:

- Create a new patient in `people` with:
  - `role=0`
  - `status=0` (active)

Auth:

- None

Query params:

- None

Request body:

```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "phone": "1234567890",
  "notes": "new patient"
}
```

Request body fields:

name: string (required)

email: string | null

phone: string | null

notes: string | null

Response 201:

{
"id": 1,
"role": 0,
"name": "John Doe",
"email": "john.doe@example.com",
"phone": "1234567890",
"status": 0,
"notes": "new patient"
}

Response fields:

id: number

role: number

name: string

email: string | null

phone: string | null

status: number

notes: string | null

Errors:

400: Name is required

500: Internal server error

## POST /api/people/import

Purpose:

- Import people records from an uploaded CSV file.
- Support importing both patients and staff.
- Set imported records to `status=0` (active) by default.
- Return import summary including inserted and failed row counts.

Auth:

- None

Query params:

- None

Request body:

- `multipart/form-data`

Form fields:

- `file`: CSV file (required)

CSV columns:

- `name`: string (required)
- `email`: string (required)
- `phone`: string (optional)
- `notes`: string (optional)
- `role`: string (required) // `patient` or `staff`

Response 200:

```json
{
  "message": "Import completed",
  "insertedCount": 2,
  "failedCount": 1,
  "failed": [
    {
      "row": 4,
      "error": "Invalid role"
    }
  ]
}
```

Response fields:

message: string

insertedCount: number

failedCount: number

failed: array

failed[].row: number

failed[].error: string

Errors:

400: No file uploaded

500: Internal server error

## DELETE /api/people/:id

Purpose:

- Delete a person by `id`.

Auth:

- None

Query params:

- None

Path params:

- `id`: person id

Request body:

- None

Response 200:

```json
{
  "message": "Person deleted successfully",
  "deletedId": 1
}
```

## PUT /api/people/:id

Purpose:

- Update a person by `id`.

Auth:

- None

Query params:

- None

Path params:

- `id`: person id

Request body:

```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "phone": "1234567890",
  "status": 0,
  "notes": "updated notes"
}
```

Request body fields:

name: string

email: string | null

phone: string | null

status: number

notes: string | null

Response 200: 1

Response fields:

number (updated person id)

Errors:

400: Invalid person id

500: Internal server error

# Sessions

## GET /api/sessions/export

Purpose:

- Export sessions to a CSV file.
- Support filtering by search text, session status, and staff.
- Return exported session data in CSV format.

Auth:

- None

Query params:

- `search`: string, optional, default = `""`
- `status`: number, optional, session status filter
- `staffId`: number, optional, staff id filter

Request body:

- None

Response 200:

- File download: CSV

CSV columns:

- `Session`
- `Patient`
- `Staff`
- `Status`
- `Date`
- `Time`
- `Duration (min)`

Errors:

500: Internal server error

## GET /api/sessions

Purpose:

- Get a paginated list of sessions with patient/staff names (joined from `people`).
- Support searching by session name, patient name, or staff name.
- Support filtering by session status and staff.
- Support sorting by session start time.
- Return frontend-friendly session fields.

Auth:

- None

Query params:

- `page`: number, optional, default = `1`
- `limit`: number, optional, default = `5`
- `search`: string, optional, default = `""`
- `status`: number, optional, session status filter
- `staffId`: number, optional, staff id filter
- `sortTime`: string, optional, sort by session start time:
  - `asc` = ascending
  - any other value or omitted = descending

Request body:

- None

Response 200:

```json
{
  "data": [
    {
      "id": 1,
      "name": "Regular Meet",
      "patientName": "John Doe",
      "patientId": 1,
      "staff": "Dr Smith",
      "staffId": 2,
      "status": 0,
      "date": "2024-01-15",
      "time": "14:00",
      "startAt": "2024-01-15T14:00",
      "endAt": "2024-01-15T15:00",
      "duration": "60m"
    }
  ],
  "page": 1,
  "limit": 5,
  "total": 20,
  "totalPages": 4
}
```

Response fields:

data: array

data[].id: number

data[].name: string

data[].patientName: string

data[].patientId: number

data[].staff: string

data[].staffId: number

data[].status: number

data[].date: "YYYY-MM-DD"

data[].time: "HH:mm"

data[].startAt: "YYYY-MM-DDTHH:mm"

data[].endAt: "YYYY-MM-DDTHH:mm"

data[].duration: string | null

page: number

limit: number

total: number

totalPages: number

Errors:

500: Internal server error

## POST /api/sessions/add-session

Purpose:

- Create a new session in `sessions` with:
  - `status=0` (scheduled)
  - linked patient and staff
  - Melbourne timezone start/end datetime

Auth:

- None

Query params:

- None

Request body:

```json
{
  "sessionName": "Initial Consultation",
  "patientId": 1,
  "staffId": 2,
  "startAt": "2026-03-14T14:00:00",
  "endAt": "2026-03-14T15:00:00"
}
```

Request body fields:

sessionName: string (required)

patientId: number | string (required)

staffId: number | string (required)

startAt: ISO datetime string (required)

endAt: ISO datetime string (required)

Response 201:

```json
{
  "id": 1,
  "name": "Initial Consultation",
  "patient_id": 1,
  "staff_id": 2,
  "status": 0,
  "start_at": "2026-03-14T14:00:00.000+11:00",
  "end_at": "2026-03-14T15:00:00.000+11:00"
}
```

Response fields:

id: number

name: string

patient_id: number

staff_id: number

status: number

start_at: ISO datetime string

end_at: ISO datetime string

Errors:

400: Name is required

400: Invalid patient or staff id

400: Invalid date/time format

400: Start time must be earlier than end time

500: Internal server error

## PUT /api/sessions/:id

Purpose:

- Update a session by `id`.

Auth:

- None

Query params:

- None

Path params:

- `id`: session id

Request body:

```json
{
  "sessionName": "Follow-up Session",
  "patientId": 1,
  "staffId": 2,
  "status": 1,
  "startAt": "2026-03-14T14:00:00",
  "endAt": "2026-03-14T15:00:00"
}
```

Request body fields:

sessionName: string (required)

patientId: number | string

staffId: number | string

status: number

startAt: ISO datetime string (required)

endAt: ISO datetime string (required)

Response 200:

```json
{
  "id": 1,
  "name": "Follow-up Session",
  "patient_id": 1,
  "staff_id": 2,
  "status": 1,
  "start_at": "2026-03-14T14:00:00.000+11:00",
  "end_at": "2026-03-14T15:00:00.000+11:00"
}
```

Response fields:

id: number

name: string

patient_id: number

staff_id: number

status: number

start_at: ISO datetime string

end_at: ISO datetime string

Errors:

400: Invalid session id

400: Name is required

400: Invalid date/time format

400: Start time must be earlier than end time

500: Internal server error

## DELETE /api/sessions/:id

Purpose:

- Delete a session by `id`.

Auth:

- None

Query params:

- None

Path params:

- `id`: session id

Request body:

- None

Response 200:

```json
{
  "id": 1,
  "name": "Follow-up Session",
  "patient_id": 1,
  "staff_id": 2,
  "status": 1,
  "start_at": "2026-03-14T14:00:00.000+11:00",
  "end_at": "2026-03-14T15:00:00.000+11:00"
}
```

Response fields:

id: number

name: string

patient_id: number

staff_id: number

status: number

start_at: ISO datetime string

end_at: ISO datetime string

Errors:

500: Internal server error

## PATCH /api/sessions/:id/status

Purpose:

- Update the status of a session by `id`.

Auth:

- None

Query params:

- None

Path params:

- `id`: session id

Request body:

```json
{
  "status": 1
}
```

Request body fields:

status: number (required) // 0=scheduled, 1=completed, 2=cancelled

Response 200:

```json
{
  "id": 1,
  "name": "Follow-up Session",
  "patient_id": 1,
  "staff_id": 2,
  "status": 1,
  "start_at": "2026-03-14T14:00:00.000+11:00",
  "end_at": "2026-03-14T15:00:00.000+11:00"
}
```

Response fields:

id: number

name: string

patient_id: number

staff_id: number

status: number

start_at: ISO datetime string

end_at: ISO datetime string

Errors:

400: Invalid session id

400: Invalid status

404: Session not found

500: Internal server error

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

## GET /api/dashboard/recent-activities

Purpose:

- Get the 5 most recent activity records from `recent_activity`.
- Return frontend-friendly activity fields.

Auth:

- None

Query params:

- None

Request body:

- None

Response 200:

```json
[
  {
    "id": 1,
    "message": "Session marked as completed",
    "createdAt": "2026-03-20T03:30:00.000Z"
  }
]
```

Response fields:

id: number

message: string

createdAt: timestamp string

Errors:

500: Internal server error
