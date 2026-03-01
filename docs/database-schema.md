# Database Schema (PostgreSQL)

## Tables

### people

- id (PK)
- role (SMALLINT)
  - 0 = patient
  - 1 = staff
- name (VARCHAR(100), NOT NULL)
- email (VARCHAR(250), NULL, UNIQUE)
- phone (VARCHAR(20), NULL)
- status (SMALLINT, NOT NULL)
  - 0 = active
  - 1 = inactive
- notes (TEXT, NULL)
- created_at (TIMESTAMPTZ, NOT NULL, default now)
- updated_at (TIMESTAMPTZ, NOT NULL, default now)

Rules:

- email/phone must have at least one non-null value.

### sessions

- id (PK)
- name (VARCHAR(100), NULL)
- patient_id (FK -> people.id, NOT NULL)
- staff_id (FK -> people.id, NOT NULL)
- status (SMALLINT, NOT NULL)
  - 0 = scheduled
  - 1 = completed
  - 2 = cancelled
- start_at (TIMESTAMPTZ, NOT NULL)
- end_at (TIMESTAMPTZ, NULL)
- created_at (TIMESTAMPTZ, NOT NULL, default now)
- updated_at (TIMESTAMPTZ, NOT NULL, default now)

Rules:

- end_at IS NULL OR end_at > start_at
- duration can be derived from (end_at - start_at) when end_at is not null.

## Notes

- Doctors and patients are stored in the same `people` table (differentiated by role).
- Patient "last session" is derived from sessions table (do not store in people).

## DDL

```sql
    -- placeholder
```
