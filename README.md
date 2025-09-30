CivilVigilance – Mobile App (Expo/React Native)

Overview
- CivicVigilance turns everyday citizens into community watchdogs. Snap a photo of a civic problem (pothole, garbage, broken streetlight), auto‑tag its location, and share it publicly while notifying the right authorities. Follow issues in a local feed, upvote for priority, and track your own reports.

Key Features
- Simple report flow: take/upload photo → add category → auto location → short description → preview and share.
- Home feed: trending, newest, and nearby filters with upvotes, comments, and sharing.
- Social sharing: generate a formatted post and open the native share sheet. For X (Twitter), open the tweet composer with prefilled text; attach the image via the OS share sheet.
- Profile & settings: view “My Reports”, manage notifications and logout.
- Authentication: email/password only (no social logins for now).

Tech Stack
- App: Expo (React Native) + TypeScript + React Navigation
- Auth & DB: SQLite (local-first using expo-sqlite). Supabase (auth, Postgres, storage) can be enabled later without code changes.
- Location & Media: expo-location, expo-image-picker, expo-sharing
- Maps: react-native-maps (optional for pin adjustment)

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
   - Node 18+, pnpm or npm, Expo CLI
   - A Supabase project (free tier is fine)

2) Clone and install
   - `pnpm install` or `npm install`

3) Configure environment
   - Copy `.env.example` to `.env`
   - Fill `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY`

4) Create database tables
   - In the Supabase SQL editor, paste and run `db/schema.sql` from this repo.

5) Run the app
   - `pnpm expo start` or `npx expo start`
   - Launch on iOS Simulator, Android Emulator, or a physical device with Expo Go.

How Reporting Works (Flow)
- Capture: Use in‑app camera or gallery upload.
- Location: Request permission and auto‑fetch coordinates; reverse geocode to an address.
- Details: Choose a category (Pothole, Garbage, Streetlight, Water Leak, Other) and enter a short description.
- Preview & Share: App builds a clear post text including address and a map link. Share via native sheet or open X composer.

Data Model (Supabase)
- `profiles`: basic user profile linked to auth user id
- `issues`: each civic report with metadata (title, description, category, image, lat/lng, address)
- `votes`: one row per user per issue with `+1` or `-1`
- `comments`: threaded discussion for each issue
- `authorities`: optional mapping of areas/types → social handles used for suggestions

File: db/schema.sql documents these tables and constraints.

Environment Variables
- `EXPO_PUBLIC_SUPABASE_URL` – your Supabase URL
- `EXPO_PUBLIC_SUPABASE_ANON_KEY` – your anon key

Notes on Social Posting
- X (Twitter) limits programmatic posting with images for 3rd‑party apps. The app opens the tweet composer with prefilled text and lets users attach the selected image via the OS share sheet. This matches the UX intent without requiring elevated API access.

Extending the App
- Notifications: use Expo Notifications to alert users on comments/upvotes.
- Moderation: add image/text moderation webhooks before publishing an issue.
- Authority suggestions: populate `authorities` with local handles and simple geofences; recommend tags based on proximity and category.

Screens Included
- Auth: Login, Sign Up, Forgot Password
- Feed: issue list with sorting, post detail with comments
- Report Issue: camera/gallery, map pin, preview/share
- Profile: user info, “My Reports”, settings

Design Notes
- The folder structure mirrors the reference images you provided. Components are small and reusable; screens own their layout; hooks contain data and session logic; `lib/` centralizes platform services like auth, location, and sharing.

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
- Updated screens with cleaner typography, rounded cards, and chips for categories.
- Simplified auth: email + password only; social logins removed from UI and code paths.

Demo Mode (no Supabase yet)
- If `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY` are not set, the app runs in Demo Mode:
  - You can sign up or sign in with any email/password.
  - Feed shows local demo issues; creating an issue stores it locally (AsyncStorage).
  - Comments also store locally.
  - Set the env keys later to switch to real Supabase mode — no code changes needed.
Local SQLite Mode
- The app ships with a full local database using `expo-sqlite` so you can run completely offline:
  - Tables: `users`, `profiles`, `issues`, `votes`, `comments (parent_id for threads)`, `authorities`.
  - Authentication: email/password with bcryptjs hashing stored in SQLite; session kept in AsyncStorage.
  - Voting: stored per user in `votes` and aggregated into `issues.upvotes/downvotes`.
  - Comments: threaded via `comments.parent_id`.
- Schema is created automatically at first run. See `lib/db.ts` for the SQL.
- When you later add Supabase env keys, the app switches from SQLite to Supabase transparently.
