Frontend Specification – CivicVigilance (Expo/React Native)

Overview
- The app is mobile‑first with local‑first behavior. It supports two persistence modes:
  - Local SQLite (default): fully offline, email/password auth with bcrypt hashing, same schema shape as the backend.
  - Supabase (cloud): enable by adding env keys. Hooks automatically use Supabase API.

Architecture
- Navigation: React Navigation (NativeStack + BottomTabs)
- State/data: lightweight hooks per feature (`hooks/useAuth`, `hooks/useIssues`)
- Storage: `expo-sqlite` DB in local mode; AsyncStorage for session id and small prefs
- Media/Location: `expo-camera` (CameraView), `expo-location` (watchPosition + reverse geocode), `expo-sharing` for share sheet

Screens and Features
- Auth
  - Sign Up
    - Inputs: email, password, confirm
    - Validation: non‑empty, password length >= 6, passwords match
    - Local mode: inserts into `users` with bcrypt hash; creates `profiles` row; sets session id
    - Supabase mode: uses `supabase.auth.signUp`
  - Sign In
    - Inputs: email, password
    - Local mode: bcrypt compare, set session id
    - Supabase mode: `supabase.auth.signInWithPassword`
  - Forgot Password
    - Supabase mode only (sends reset link). Local mode: no‑op

- Home Feed
  - Sort chips: trending (score), newest. Nearby reserved for future geo sort
  - Card: image, title, address/description, Reddit‑style action bar (upvote/downvote/comments/share)
  - Interactions
    - Upvote/Downvote: optimistic toggle; local mode writes to `votes` and recalculates counters; cloud mode uses `/issues/{id}/vote`
    - Comments chip: opens post detail
    - Share: opens OS share sheet/X composer
  - Empty state: feed seeds a few demo posts on first open
  - FAB: camera icon opens Report flow

- Post Detail (Threaded)
  - Top: title, address, body, action bar with synced counts
  - Comments: nested tree via `parent_id`; “Reply” on each comment; composer at bottom with context (“Reply…”). Cancel reply resets composer
  - Data source: SQLite or cloud `/issues/{id}` + `/issues/{id}/comments`

- Report Flow
  - Stage 1: Live Capture
    - CameraView full‑screen; bottom overlay: large central shutter, flash toggle, camera flip
    - Header overlay: live address, lat/lng, ±accuracy (from `useLiveLocation`)
    - Simulator fallback: shutter uses a sample image so flow is testable
  - Stage 2: Details & Share
    - Preview image, “Describe the issue” card (title/description), “Category” chips, “Location” card (Use current location, Retake)
    - Buttons: Share preview (opens share sheet); Submit (validates: requires image + title + coords)
    - On submit: local mode inserts into `issues`, cloud mode calls POST `/issues`

- Profile
  - Header: avatar (tap to change via media library), name, joined year
  - Sections: My Reports, Settings, Notifications (toggle prefs stored locally), Linked Accounts (placeholder), Privacy Policy, Terms of Service
  - Logout: confirmation prompt

Theming and Components
- ActionBar: Reddit‑style chips with icons and compact counts
- Buttons: primary/outline/ghost variants; consistent padding and typography
- ListItem: icon + title + optional subtitle + chevron for settings/menus
- CategoryPicker: horizontal chip selector for issue categories
- Color palette: light neutral background (`#f6f7f9`), white cards with subtle shadow, black/gray text and accents; can be themed globally later

Permissions and Edge Cases
- Camera permission: requested on first capture; “Enable Camera” button appears when denied
- Location permission: requested before capture/share; live overlay shows when available
- Simulator: shows hint and uses a sample image when no camera is present
- Offline: local mode requires no network; sync strategy can be added later if needed

Navigation Map
- Tabs: Home (Feed) • Report • Profile
- Stacks:
  - FeedStack: `Feed` → `PostDetail`
  - ProfileStack: `ProfileHome` → `MyReports` • `Settings` • `Notifications` • `LinkedAccounts` • `Policy`
- AuthStack: `Login` • `Signup` • `ForgotPassword`

Local SQLite Data Shape (mirrors backend)
- users(id, email, password_hash, created_at)
- profiles(user_id, full_name, avatar_url, created_at)
- issues(id, user_id, title, description, category, image_url, lat, lng, address, upvotes, downvotes, created_at)
- votes(id, user_id, issue_id, value, created_at)
- comments(id, issue_id, user_id, parent_id, content, created_at)
- authorities(id, name, handle, region)

Switching to Cloud Mode
- Add `.env` values (`EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_ANON_KEY`) and restart with cache clear
- Hooks automatically use Supabase; UI/UX unchanged

Error Handling
- Toasts/alerts for submit failures (e.g., missing location), optimistic UI for votes
- Duplicate email (SQLite) returns “Email already registered”

Testing Notes
- Seeded demo issues appear if DB is empty so feed/UI can be evaluated immediately
- Use simulator shutter to test full Report flow without hardware camera

