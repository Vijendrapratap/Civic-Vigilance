Backend Specification – CivicVigilance

Purpose
- Provide a clear API and data model to power the mobile app. The app currently runs in local‑first SQLite mode; this document defines the network API and a Postgres schema (Supabase‑ready) so the backend can be implemented and swapped in without frontend changes.

Principles
- Simple, REST‑style JSON endpoints
- JWT bearer auth (RFC6750). Access token in `Authorization: Bearer <token>`
- Pagination via `limit` + `cursor` (opaque string) for forward paging
- Idempotent writes where feasible (upserts for votes)
- All times in ISO‑8601 UTC

Authentication
- Signup
  - POST `/auth/signup`
  - Body: `{ email, password, full_name? }`
  - 201 → `{ user: { id, email, full_name, created_at }, access_token, expires_in }`
  - 409 → `{ error: 'EMAIL_EXISTS' }`
- Login
  - POST `/auth/login`
  - Body: `{ email, password }`
  - 200 → `{ user, access_token, expires_in }`
  - 401 → `{ error: 'INVALID_CREDENTIALS' }`
- Logout
  - POST `/auth/logout` (server may be stateless; optional token revocation)
  - 204
- Password reset (optional for phase 1)
  - POST `/auth/forgot-password` `{ email }` → 202
  - POST `/auth/reset-password` `{ token, new_password }` → 200

Profiles
- Get current profile
  - GET `/me`
  - 200 → `{ id, email, full_name, avatar_url, created_at }`
- Update current profile
  - PATCH `/me`
  - Body: `{ full_name?, avatar_url? }`
  - 200 → updated profile

Issues
- List
  - GET `/issues?sort=trending|newest|nearby&lat?=&lng?=&limit?=&cursor?`
  - 200 → `{ items: Issue[], next_cursor?: string }`
- Get by id
  - GET `/issues/{id}` → 200 → Issue
- Create
  - POST `/issues`
  - Body: `{ title, description?, category, image_url?, lat?, lng?, address? }`
  - 201 → Issue (with server fields: id, user_id, upvotes, downvotes, comments_count, created_at)
- Update (owner only)
  - PATCH `/issues/{id}` → 200 → Issue
- Delete (owner/mod)
  - DELETE `/issues/{id}` → 204

Votes
- Cast/toggle
  - PUT `/issues/{id}/vote`
  - Body: `{ value: -1 | 0 | 1 }` (0 clears vote)
  - 200 → `{ vote: -1|0|1, upvotes: number, downvotes: number }`

Comments
- List for issue
  - GET `/issues/{id}/comments?limit?=&cursor?`
  - 200 → `{ items: Comment[], next_cursor? }`
- Create
  - POST `/issues/{id}/comments`
  - Body: `{ content, parent_id? }`
  - 201 → Comment

Authorities (optional)
- Suggest handles for an area/type
  - GET `/authorities/suggest?region?=&category?`
  - 200 → `{ handles: string[] }`

Uploads (recommended)
- Create pre‑signed upload URL
  - POST `/uploads/sign`
  - Body: `{ content_type, extension }`
  - 200 → `{ upload_url, public_url }`
  - Client uploads the image to `upload_url` and stores `public_url` in `image_url` on issue

Postgres Schema (Supabase‑ready)
- users (managed by auth; reference via `auth.users` in Supabase)
- profiles
  - `id uuid primary key references auth.users on delete cascade`
  - `full_name text, avatar_url text, created_at timestamptz default now()`
- issues
  - `id uuid primary key default gen_random_uuid()`
  - `user_id uuid not null references auth.users(id) on delete cascade`
  - `title text not null, description text, category text check (category in ('pothole','garbage','streetlight','water','other'))`
  - `image_url text, lat double precision, lng double precision, address text`
  - `upvotes integer not null default 0, downvotes integer not null default 0`
  - `score integer generated always as (upvotes - downvotes) stored`
  - `comments_count integer not null default 0`
  - `created_at timestamptz default now()`
  - Indexes: `(created_at desc)`, `(score desc)`
- votes
  - `id uuid primary key default gen_random_uuid()`
  - `user_id uuid not null references auth.users(id) on delete cascade`
  - `issue_id uuid not null references issues(id) on delete cascade`
  - `value smallint not null check (value in (-1,1))`
  - `created_at timestamptz default now()`
  - Unique `(user_id, issue_id)`
- comments
  - `id uuid primary key default gen_random_uuid()`
  - `issue_id uuid not null references issues(id) on delete cascade`
  - `user_id uuid not null references auth.users(id) on delete cascade`
  - `parent_id uuid references comments(id) on delete cascade`
  - `content text not null`
  - `created_at timestamptz default now()`
  - Index `(issue_id)`, `(parent_id)`
- authorities (optional)
  - `id uuid primary key default gen_random_uuid(), name text, platform text default 'twitter', handle text, region text`

Triggers
- Keep `issues.upvotes/downvotes` in sync with `votes`
- Keep `issues.comments_count` in sync with `comments`

Security (Supabase RLS examples)
- profiles: select all, insert/update only self
- issues: select all, insert authenticated, update only owner
- votes: select all, insert/update only self
- comments: select all, insert only authenticated

Error format
- `{ error: { code: '...', message: '...' } }`
- Common: `UNAUTHORIZED`, `FORBIDDEN`, `NOT_FOUND`, `INVALID_INPUT`, `RATE_LIMITED`

Pagination
- Supply `limit` and `cursor`
- Response includes `next_cursor`; clients pass it back as `cursor` to fetch next page

Example Payloads
- Create Issue request
  - `{ "title": "Pothole near Maple St.", "description": "Large pothole causing bikes to swerve.", "category": "pothole", "image_url": "https://cdn.../pothole.jpg", "lat": 37.776, "lng": -122.42, "address": "Maple St & 8th Ave" }`
- Create Issue response (201)
  - `{ "id":"...","user_id":"...","title":"...","description":"...","category":"pothole","image_url":"...","lat":37.776,"lng":-122.42,"address":"...","upvotes":0,"downvotes":0,"comments_count":0,"created_at":"2025-10-01T10:10:10Z" }`

Deployment Notes
- Supabase: use SQL in `db/schema.sql` as a base (add `comments_count` column + triggers)
- Object storage: Supabase Storage or S3; return public URL to client
- Rate limiting: IP + user based for write endpoints
- Observability: request logging, slow query logs; structured logs with request id

