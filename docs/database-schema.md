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
    CREATE TABLE IF NOT EXISTS people (
  id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

  role        SMALLINT NOT NULL CHECK (role IN (0, 1)),        -- 0=patient, 1=staff(doctor)
  name        VARCHAR(100) NOT NULL,

  email       VARCHAR(250),
  phone       VARCHAR(20),

  status      SMALLINT NOT NULL DEFAULT 0 CHECK (status IN (0, 1)), -- 0=active, 1=inactive
  notes       TEXT,

  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- email/phone (at least one non-empty)
  CONSTRAINT people_email_or_phone_chk CHECK (email IS NOT NULL OR phone IS NOT NULL)
);

CREATE TABLE IF NOT EXISTS sessions (
  id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

  name        VARCHAR(100) NOT NULL,

  patient_id  BIGINT NOT NULL REFERENCES people(id) ON DELETE RESTRICT,
  staff_id    BIGINT NOT NULL REFERENCES people(id) ON DELETE RESTRICT,

  status      SMALLINT NOT NULL DEFAULT 0 CHECK (status IN (0, 1, 2)), -- 0=scheduled, 1=completed, 2=cancelled

  start_at    TIMESTAMPTZ NOT NULL,
  end_at      TIMESTAMPTZ,

  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- end_at can be empty; if not empty, it must be after start_at.
  CONSTRAINT sessions_end_after_start_chk CHECK (end_at IS NULL OR end_at > start_at)
);

CREATE TABLE recent_activity (
  id SERIAL PRIMARY KEY,
  type VARCHAR(50) NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

```
