CivilVigilance – Mobile App (Expo/React Native)

Overview
- CivicVigilance turns everyday citizens into community watchdogs. Capture a civic issue (pothole, garbage, streetlight, water leak) with the in‑app camera, auto‑tag its precise location in real‑time, and share it publicly while notifying the right authorities. Follow issues in a local feed, upvote for priority, discuss in threads, and track your own reports.

Key Features
- Live capture only: full‑screen camera with shutter, live address, lat/lng and accuracy overlay; simulator fallback image so you can test on iOS Simulator.
- Report details: category chips, title/description, auto‑fill location; share preview and submit.
- Reddit‑style feed: action chips for Upvote, Downvote, Comments, Share; cards open the thread; optimistic voting.
- Threaded comments: nested replies with “Reply” per comment and composer at the bottom (“Join the conversation”).
- Profile & settings: avatar, joined year, My Reports, Notifications, Privacy/Terms, Logout.
- Authentication: email/password only (SQLite local auth). Supabase can be enabled later without code changes.

Tech Stack
- App: Expo (React Native) + TypeScript + React Navigation
- Local DB & Auth: expo-sqlite + bcryptjs; session in AsyncStorage
- Optional cloud: Firebase (Auth + Firestore) or Supabase (Auth + Postgres + Storage), controlled by env flags
- Sensors & Media: expo-camera (CameraView), expo-location (live watch), expo-sharing

Repository Layout
- `App.tsx` – app entry with navigation
- `index.ts` – registers the root component (Expo)
- `screens/` – all app screens (Auth, Feed, Report, Profile)
- `components/` – reusable UI (IssueCard, SortBar, FAB)
- `hooks/` – `useAuth`, `useIssues` for data and session logic
- `lib/` – supabase client, location, sharing helpers
- `types/` – TypeScript interfaces for Issues, Comments, Votes
- `db/schema.sql` – Supabase/Postgres schema
- `.env.example` – environment variable template

Quick Start
1) Prereqs
   - Node 18/20, npm, Expo CLI
   - Optional: a Supabase project (only if you want cloud mode now)

2) Clone and install
   - `pnpm install` or `npm install`

3) Configure environment (optional)
   - Copy `.env.example` to `.env`.
   - To use Firebase (preferred): fill `EXPO_PUBLIC_FIREBASE_*` values from your Firebase project (API key, Project ID, App ID, etc.).
   - To use Supabase instead: fill `EXPO_PUBLIC_SUPABASE_URL` + `EXPO_PUBLIC_SUPABASE_ANON_KEY`.
   - If neither is set, the app runs in local SQLite mode automatically.

4) Create database tables
   - In the Supabase SQL editor, paste and run `db/schema.sql` from this repo.

5) Run the app
   - `pnpm expo start` or `npx expo start`
   - Launch on iOS Simulator, Android Emulator, or a physical device with Expo Go.

How Reporting Works (Flow)
- Stage 1 – Live Capture
  - In‑app camera (CameraView) with a header overlay: live address, lat/lng (5 dp), and ±accuracy.
  - Shutter captures a photo. On simulator (no camera), it uses a sample image so you can proceed.
  - On capture, the latest live coordinates/address are bound to the report.
- Stage 2 – Details & Share
  - Add a short title and description; pick a category chip (Pothole, Garbage, Streetlight, Water, Other).
  - “Use current location” refreshes the coordinates/address; “Retake” returns to capture.
  - “Share preview” composes a post (text + map link + authority tags) and opens OS share/X composer.
  - Submit validates: requires photo, title, and coordinates.

Data Model (Supabase)
- `profiles`: basic user profile linked to auth user id
- `issues`: each civic report with metadata (title, description, category, image, lat/lng, address)
- `votes`: one row per user per issue with `+1` or `-1`
- `comments`: threaded discussion for each issue
- `authorities`: optional mapping of areas/types → social handles used for suggestions

File: db/schema.sql documents these tables and constraints.

Environment Variables
- Firebase (preferred if set):
  - `EXPO_PUBLIC_FIREBASE_API_KEY`
  - `EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN`
  - `EXPO_PUBLIC_FIREBASE_PROJECT_ID`
  - `EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET`
  - `EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
  - `EXPO_PUBLIC_FIREBASE_APP_ID`
- Supabase:
  - `EXPO_PUBLIC_SUPABASE_URL`
  - `EXPO_PUBLIC_SUPABASE_ANON_KEY`

Notes on Social Posting
- X (Twitter) limits programmatic posting with images for 3rd‑party apps. The app opens the tweet composer with prefilled text and lets users attach the selected image via the OS share sheet. This matches the UX intent without requiring elevated API access.

Extending the App
- Notifications: use Expo Notifications to alert users on comments/upvotes.
- Moderation: add image/text moderation webhooks before publishing an issue.
- Authority suggestions: populate `authorities` with local handles and simple geofences; recommend tags based on proximity and category.

Screens (PRD)
- Auth
  - Sign Up: email + password (confirm), validation and duplicate email handling (SQLite); in Supabase mode, uses auth API.
  - Sign In: email + password; local session in AsyncStorage; logout clears session.
  - Forgot Password: no‑op in SQLite mode; in Supabase mode it sends a reset link with allowed redirect URLs.
- Home Feed
  - Sort tabs: Trending (score), Newest (created_at); Nearby reserved for future geo sort.
  - Card anatomy: title, image, address/description, action bar (Upvote / Downvote / Comments / Share), counts formatted (e.g., 2.9K).
  - Vote behavior: optimistic. Tap same vote toggles off. In SQLite mode, votes write to `votes`; we recalc counters. In Supabase mode, trigger updates counters.
  - Share: opens OS share sheet (and/or X composer intent) with composed text.
- Post Detail (Thread)
  - Title, meta (address), body, action bar; counts synced with the selected issue.
  - Threaded comments: nested via `parent_id`. Each comment shows “Reply”; composer says “Reply…” when replying.
  - Send comment adds to SQLite or Supabase `comments` and updates the view.
- Report
  - Live capture → details flow as described above. Submit persists to SQLite or Supabase.
- Profile
  - Header: avatar (tap to change), name, Joined YEAR.
  - Menu: My Reports, Settings, Notifications, Linked Accounts, Privacy Policy, Terms of Service.
  - Notifications: toggle comments, my report updates, mentions, nearby, email updates (stored locally for now).
  - Linked Accounts: placeholder (email‑only auth in this build).

Design Notes
- The structure mirrors the design references. Components are small and reusable; screens own layout; hooks contain data/session logic; `lib/` centralizes platform services (camera, location, DB, sharing).

Product Scope (from PRD)
- Onboarding & Authentication
  - Email/password login with validation
  - OAuth logins: Google, Apple, Facebook, Twitter (X)
  - Create Account collects Name, Email, optional DOB/Location, hashed password
  - Forgot Password sends a secure reset link
- Home Feed
  - Vertical list of issue cards sortable by Trending, Newest, Nearby
  - Each card: title, image, up/down votes, comments count, share
  - Interactions: vote once (toggle), open comments, share, create new report
- Report Issue Flow
  - Step 1: Capture evidence via camera or gallery (permissions handled)
  - Step 2: Add details: category selection, auto geolocation + reverse geocode with adjustable pin, short description, authority tag suggestions
  - Step 3: Preview & Share: compose text with address/map link + suggested handles; share to X (composer) or via OS share sheet; copy text
- Profile & Settings
  - User info and linked accounts
  - My Reports list with engagement/status
  - Notification preferences, Privacy/Terms, Logout

Design Assets
- All wireframes and screenshots are under `design/`. Keep future design references and file-structure snapshots in this folder.

UI/UX Notes
- Feed and detail follow Reddit patterns for familiarity: chips, counts, nested threads.
- Report emphasizes accuracy: live geo overlay and accuracy, no gallery upload.
- Profile matches the provided design (avatar, joined, grouped options) and includes logout confirmation.

Local SQLite Mode
- Full local database using `expo-sqlite` so you can run completely offline:
  - Tables: `users`, `profiles`, `issues`, `votes`, `comments (parent_id)`, `authorities` (see `lib/db.ts`).
  - Authentication: email/password with bcryptjs hashing (bcryptjs); session id stored in AsyncStorage.
  - Votes: one per user/issue; counters recalculated and stored in `issues`.
  - Comments: nested replies via `parent_id`.
- Switching to Supabase later: add env keys and restart with cache clear; hooks and screens automatically use Supabase paths.

Permissions (why we ask)
- Camera: to capture evidence of issues.
- Location (While Using the App): to auto‑tag reports with accurate coordinates and address.
- Notifications (optional): for future updates when someone comments or your report status changes.

Error Handling & Edge Cases
- Simulator with no camera → shutter uses a sample image so flows remain testable.
- Missing GPS fix → shows “Locating…”; you can still submit after manual refresh.
- Vote toggling is optimistic; on failure UI remains usable; counters correct on next fetch.
- SQLite unique email guard returns “Email already registered”.

Roadmap
- Nearby sort using distance, map clustering and heat map.
- Media moderation flags, spam detection, block/ignore user.
- Authority handle directory by city/ward with automatic tagging.
- Push notifications for comment replies and report updates.
