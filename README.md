# DevBoard — Micro Frontend Task Management App

> A full-stack task management application built with **Micro Frontend (MFE) architecture** using Vite Module Federation, FastAPI, and MongoDB Atlas.

---

## 🌐 Live Deployment Links

| Service | URL |
|---|---|
| 🖥️ Shell App (Main) | `https://mfe-shell-kappa.vercel.app/` |
| ✅ MFE Tasks | `https://mfe-tasks-fawn.vercel.app/` |
| 📊 MFE Dashboard | `https://mfe-dashboard-five.vercel.app/` |
| 🎨 Shared UI | `https://shared-ui-khaki.vercel.app/assets/remoteEntry.js` |
| 🔧 Backend API | `https://devboard-r6rk.onrender.com` |
| 📄 API Docs | `https://devboard-r6rk.onrender.com/docs` |

> ⚠️ The backend is hosted on Render.com free tier — first request may take **30-60 seconds** to wake up from sleep.

---

## 📐 Architecture Overview

```
                        User visits shell-app
                               │
                    ┌──────────▼──────────┐
                    │      shell-app      │
                    │  (Router + Navbar)  │
                    │   localhost:3000    │
                    └──────┬──────┬───────┘
                           │      │
            Module Federation  Module Federation
            (runtime import)   (runtime import)
                           │      │
               ┌────────────▼┐    ┌▼────────────┐
               │  mfe-tasks  │    │mfe-dashboard│
               │  Port 5001  │    │  Port 5002  │
               └─────┬───────┘    └──────┬──────┘
                     │                   │
                     └─────────┬─────────┘
                               │ REST API calls
                    ┌──────────▼──────────┐
                    │     backend-api     │
                    │  FastAPI + Motor    │
                    │    Port 8000        │
                    └──────────┬──────────┘
                               │
                    ┌──────────▼──────────┐
                    │    MongoDB Atlas    │
                    │   (Free M0 Cluster) │
                    └─────────────────────┘
```

### What is Micro Frontend (MFE)?

In a normal React app, everything is in one project and deployed together. In MFE architecture:

- **Each feature is a separate React app** deployed independently
- **Shell app** acts as a "frame" that loads other apps at runtime
- **Module Federation** is the technology that makes this possible — shell imports components from other live URLs without bundling them together
- Teams can work independently, deploy independently, and even use different tech stacks

### How Module Federation Works Here

```
shell-app fetches at runtime:
  https://mfe-tasks-xxxx.vercel.app/assets/remoteEntry.js     → TasksApp component
  https://mfe-dashboard-xxxx.vercel.app/assets/remoteEntry.js → DashboardApp component
  https://shared-ui-khaki.vercel.app/assets/remoteEntry.js    → Button, Badge, Card, Skeleton
```

MFEs talk to each other **only through the shared API** — no direct prop tunneling between MFEs.

---

## 📁 Folder Structure

```
devboard/
├── .github/
│   └── workflows/
│       └── ci.yml              ← GitHub Actions CI
├── backend-api/                ← FastAPI + Motor + MongoDB
│   ├── app/
│   │   ├── database.py
│   │   ├── models.py
│   │   └── routes/
│   │       └── tasks.py
│   ├── main.py
│   ├── requirements.txt
│   ├── runtime.txt             ← Python 3.11 pinned for Render
│   └── .env.example
├── shared-ui/                  ← Shared component library (MFE)
│   └── src/components/
│       ├── Button.tsx
│       ├── Badge.tsx
│       ├── Card.tsx
│       └── Skeleton.tsx
├── mfe-tasks/                  ← Task CRUD MFE
│   └── src/
│       ├── api/tasks.ts
│       ├── components/
│       ├── hooks/useTasks.ts   ← React Query + Optimistic UI
│       ├── types/index.ts
│       └── test/               ← Vitest unit tests
├── mfe-dashboard/              ← Stats dashboard MFE
│   └── src/
│       ├── api/stats.ts
│       ├── components/
│       └── hooks/useStats.ts
├── shell-app/                  ← Host app
│   └── src/
│       ├── App.tsx             ← React.lazy + Suspense
│       ├── declarations.d.ts   ← MFE type declarations
│       └── components/
└── README.md
```

---

## ⚙️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend Framework | React 18 + TypeScript |
| Build Tool | Vite 5 |
| MFE | @originjs/vite-plugin-federation |
| Styling | Tailwind CSS |
| Data Fetching | TanStack React Query v5 |
| Backend | FastAPI (Python) |
| Database Driver | Motor (async MongoDB) |
| Database | MongoDB Atlas (M0 Free) |
| Testing | Vitest + Testing Library |
| CI | GitHub Actions |
| Frontend Deploy | Vercel |
| Backend Deploy | Render.com |

---

## 🚀 Local Setup — Step by Step

Follow this exact order. Every step matters.

### Prerequisites

Make sure you have these installed:

```bash
node --version    # v18 or higher
npm --version     # v9 or higher
python --version  # 3.11 or higher
pip --version
```

---

### Step 1 — Clone the Repository

```bash
git clone https://github.com/deepakkashyap-dev/devboard.git
cd devboard
```

---

### Step 2 — Backend Setup

```bash
cd backend-api

# Create virtual environment
python -m venv .venv

# Activate it
# On Mac/Linux:
source .venv/bin/activate
# On Windows:
.venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
touch .env
```

Now open `.env` and fill in your MongoDB Atlas credentials:

```env
MONGODB_URL=mongodb+srv://your_username:your_password@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
DB_NAME=devboard
```

> ⚠️ If your password has special characters like `@`, `#`, `!` — encode them:
> `@` → `%40`, `#` → `%23`, `!` → `%21`

Start the backend:

```bash
uvicorn main:app --reload --port 8000
```

Verify it's running:
- API: http://localhost:8000
- Interactive Docs: http://localhost:8000/docs

You should see: `{"status": "ok", "message": "DevBoard API running"}`

---

### Step 3 — MongoDB Atlas Setup (If Not Done)

1. Go to [mongodb.com/atlas](https://mongodb.com/atlas) → Create free account
2. Create a cluster → Select **M0 Free Forever**
3. **Database Access** → Add user with username + password
4. **Network Access** → Add IP → `0.0.0.0/0` (Allow from anywhere)
5. **Connect** → Drivers → Python → Copy connection string
6. Paste into your `.env` file (replace `<password>` with actual password)

The `tasks` collection is created **automatically** when the first task is inserted — no manual setup needed.

---

### Step 4 — Install Frontend Dependencies

Open **4 separate terminals** and run one command in each:

```bash
# Terminal 1 — shared-ui
cd shared-ui && npm install

# Terminal 2 — mfe-tasks
cd mfe-tasks && npm install

# Terminal 3 — mfe-dashboard
cd mfe-dashboard && npm install

# Terminal 4 — shell-app
cd shell-app && npm install
```

---

### Step 5 — Create Environment Files

**`mfe-tasks/.env.local`**
```env
VITE_API_URL=http://localhost:8000
VITE_SHARED_UI_URL=http://localhost:5003
```

**`mfe-dashboard/.env.local`**
```env
VITE_API_URL=http://localhost:8000
VITE_SHARED_UI_URL=http://localhost:5003
```

**`shell-app/.env.local`**
```env
VITE_MFE_TASKS_URL=http://localhost:5001/assets/remoteEntry.js
VITE_MFE_DASHBOARD_URL=http://localhost:5002/assets/remoteEntry.js
```

---

### Step 6 — Run All Services

> ⚠️ **Important:** Remote MFEs must be built before running — `vite-plugin-federation` does not work in dev mode for remote apps. Only shell-app uses `npm run dev`.

Run these in order (use separate terminals):

```bash
# Terminal 1 — Backend (already running from Step 2)
cd backend-api && uvicorn main:app --reload --port 8000

# Terminal 2 — shared-ui (build then preview)
cd shared-ui && npm run build && npm run preview
# Runs on: http://localhost:5003

# Terminal 3 — mfe-tasks (build then preview)
cd mfe-tasks && npm run build && npm run preview
# Runs on: http://localhost:5001

# Terminal 4 — mfe-dashboard (build then preview)
cd mfe-dashboard && npm run build && npm run preview
# Runs on: http://localhost:5002

# Terminal 5 — shell-app (dev server)
cd shell-app && npm run dev
# Runs on: http://localhost:3000
```

Open http://localhost:3000 — you should see the full app with navbar, dashboard, and tasks! ✅

---

## 🧪 Running Tests

Unit tests are written using **Vitest** and **React Testing Library** in `mfe-tasks`:

```bash
cd mfe-tasks

# Run tests once
npm test

# Run tests in watch mode (re-runs on file change)
npm run test:watch
```

### What is tested?

**`src/test/utils.test.ts`** — Pure utility function tests:
- `isOverdue()` — correctly identifies overdue tasks based on date and status
- `getPriorityLabel()` — returns correct label for each priority level

**`src/test/TaskFilter.test.tsx`** — Component tests:
- All three filter buttons render correctly
- Active filter button has correct highlight class
- Clicking a filter calls `onChange` with correct value

**`src/test/SkeletonCard.test.tsx`** — Component tests:
- Component renders without crashing
- Has `animate-pulse` class for loading animation

Expected output:

```
✓ src/test/utils.test.ts (7 tests)
✓ src/test/TaskFilter.test.tsx (4 tests)
✓ src/test/SkeletonCard.test.tsx (2 tests)

Test Files  3 passed
Tests       13 passed ✅
```

---

## 🔄 GitHub Actions CI

The CI workflow at `.github/workflows/ci.yml` automatically runs on every push to `main`.

### What it does

```
Push to GitHub
      ↓
Build shared-ui
      ↓ (depends on shared-ui)
Build mfe-tasks + Run vitest tests
Build mfe-dashboard
      ↓ (depends on both MFEs)
Build shell-app
      ↓
✅ All green = code is healthy
❌ Any red = something broke, fix before merging
```

CI only **builds and tests** — it does not deploy. Deployment is handled by Vercel automatically on every push.

### View CI status

Go to your GitHub repo → **Actions** tab → Green checkmarks per commit.

> Note: Repo must be **public** for unlimited free GitHub Actions minutes.

---

## 🌍 Deployment

### Backend — Render.com

FastAPI is deployed on [Render.com](https://render.com) free tier:

| Setting | Value |
|---|---|
| Runtime | Python 3.11 |
| Root Directory | `backend-api` |
| Build Command | `pip install -r requirements.txt` |
| Start Command | `uvicorn main:app --host 0.0.0.0 --port $PORT` |

Environment variables set on Render dashboard:
```
MONGODB_URL = mongodb+srv://...
DB_NAME     = devboard
```

> Python version is pinned to `3.11` via `runtime.txt` — required because `pydantic-core` doesn't have pre-built wheels for Python 3.14 yet, which causes build failures.

> Free tier sleeps after 15 minutes of inactivity. First request takes 30-60 seconds to wake up.

---

### Frontend — Vercel

All 3 frontends + shared-ui are deployed as **separate Vercel projects** from the same GitHub repo, each with a different Root Directory:

| Vercel Project | Root Directory | Env Variables |
|---|---|---|
| shared-ui | `shared-ui` | none |
| mfe-tasks | `mfe-tasks` | `VITE_API_URL`, `VITE_SHARED_UI_URL` |
| mfe-dashboard | `mfe-dashboard` | `VITE_API_URL`, `VITE_SHARED_UI_URL` |
| shell-app | `shell-app` | `VITE_MFE_TASKS_URL`, `VITE_MFE_DASHBOARD_URL` |

Each is a **separate Vercel project** to demonstrate true independent deployability — the core promise of MFE architecture. Updating `mfe-tasks` does not require redeploying shell or dashboard.

**Deploy order matters:**
```
1. shared-ui  → get URL
2. mfe-tasks + mfe-dashboard  → use shared-ui URL in env vars → get their URLs
3. shell-app  → use mfe-tasks + mfe-dashboard URLs in env vars
```

---

### Database — MongoDB Atlas

- Free M0 cluster (512MB storage, shared RAM/CPU)
- Hosted on AWS Mumbai region
- IP Access List set to `0.0.0.0/0` — allows connections from Render.com servers
- No manual collection creation needed — Motor creates the `tasks` collection automatically on first insert

---

## 📡 API Reference

Base URL: `https://devboard-r6rk.onrender.com` (or `http://localhost:8000` locally)

Full interactive docs at: `/docs`

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/tasks/` | Get all tasks. Optional: `?status=pending` or `?status=completed` |
| GET | `/api/tasks/stats` | Aggregate counts: total, completed, pending, overdue |
| POST | `/api/tasks/` | Create a new task |
| PUT | `/api/tasks/{id}` | Update any task fields |
| PATCH | `/api/tasks/{id}/status` | Toggle status: pending ↔ completed |
| DELETE | `/api/tasks/{id}` | Soft delete a task |

**POST /api/tasks/ — Request Body:**
```json
{
  "title": "Fix login bug",
  "description": "Users getting 401 on refresh",
  "priority": "high",
  "dueDate": "2025-06-01T00:00:00.000Z"
}
```

---

## 🗄️ MongoDB Schema

Collection name: `tasks`

```
Field        Type      Required  Default    Notes
──────────────────────────────────────────────────────────
_id          ObjectId  auto      auto       Primary key (MongoDB generated)
title        String    yes       -          max 200 chars
description  String    no        null       max 1000 chars
status       String    yes       "pending"  enum: pending | completed
priority     String    yes       "medium"   enum: low | medium | high
dueDate      Date      yes       -          ISO 8601 format
createdAt    Date      auto      now        Set on insert
isDeleted    Boolean   auto      false      Soft delete flag
```

Sample document in Atlas:
```json
{
  "_id": "665f1a2b3c4d5e6f7a8b9c0d",
  "title": "Fix login bug",
  "description": "Users getting 401 on refresh",
  "status": "pending",
  "priority": "high",
  "dueDate": "2025-06-01T00:00:00.000Z",
  "createdAt": "2025-05-15T10:30:00.000Z",
  "isDeleted": false
}
```

---

## 🧠 Design Decisions

### Soft Delete vs Hard Delete
Chose **soft delete** (`isDeleted: true` flag). Reasoning: if a task is accidentally deleted, data can be recovered. All queries filter `isDeleted: false` so deleted tasks never appear in the UI. A future admin panel could show deleted tasks for audit purposes.

### React Query over useEffect
Used **TanStack React Query v5** instead of plain `useEffect` + `useState`. Benefits: automatic caching, background refetching, built-in loading/error states, and simple optimistic update API.

### Optimistic UI on Status Toggle
When a user clicks "Mark Done", the UI updates **immediately** without waiting for the API. If the API call fails, the UI rolls back to the previous state. This makes the app feel instant even on slow connections.

### Shared UI as a separate MFE
Created `shared-ui` as a fourth Module Federation remote so both `mfe-tasks` and `mfe-dashboard` consume the same `Button`, `Badge`, `Card`, and `Skeleton` components. This avoids code duplication and ensures visual consistency. In production, updating a shared component requires only redeploying `shared-ui`.

### /stats route defined before /{task_id}
The `/stats` endpoint must be declared **before** `/{task_id}` in FastAPI's router. If reversed, FastAPI would treat the string `"stats"` as a task ID and return a 400 validation error.
