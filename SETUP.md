# Family Library App - Setup Instructions

## Quick Start

```bash
# Navigate to the app
cd library-app

# Rebuild better-sqlite3 native module (important!)
npm rebuild better-sqlite3

# Start the development server
npm run dev
```

Then open: **http://localhost:3000**

## If You Get Database Errors

The app uses `better-sqlite3` which is a native module. If you see errors like "Could not locate the bindings file":

```bash
# Option 1: Rebuild
npm rebuild better-sqlite3

# Option 2: Reinstall
rm -rf node_modules package-lock.json
npm install
npm rebuild better-sqlite3
```

## First Time Setup

1. Open http://localhost:3000
2. Click "Sign up"
3. Create your account (you'll be admin automatically as first user)
4. Family members can create their own accounts
5. Start adding books!

## Features Ready

✅ Multi-user authentication
✅ Book management (CRUD)
✅ ISBN lookup (Open Library API)
✅ Reading status tracking (Want to Read, Reading, Read, Abandoned)
✅ Personal ratings and reviews
✅ Custom shelves
✅ Tags
✅ Family activity feed
✅ Statistics dashboard

## Tests

```bash
npm test
```

23 tests passing!

## Project Structure

```
library-app/
├── src/
│   ├── app/
│   │   ├── api/          # Backend API routes
│   │   ├── login/        # Login page
│   │   ├── register/     # Registration page
│   │   ├── dashboard/    # User dashboard
│   │   ├── books/        # Books pages
│   │   └── shelves/      # Shelves page
│   ├── contexts/         # React contexts (Auth)
│   ├── lib/              # Utilities (db, auth)
│   └── __tests__/        # Tests
├── library.db            # SQLite database (auto-created)
└── README.md
```

## API Endpoints

- POST `/api/auth` - Login/Register
- GET `/api/user` - Get current user
- GET `/api/family` - Get all family members
- GET `/api/books` - Get books (with filters)
- POST `/api/books` - Add book
- PUT `/api/books/:id/status` - Update reading status
- GET `/api/shelves` - Get user's shelves
- POST `/api/shelves` - Create shelf
- GET `/api/tags` - Get all tags
- GET `/api/stats` - Get statistics

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Database**: SQLite (better-sqlite3)
- **Auth**: JWT + bcrypt
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Testing**: Vitest

## Environment Variables

Create `.env.local`:

```env
DATABASE_PATH=./library.db
JWT_SECRET=change-this-to-something-secret
NEXT_PUBLIC_APP_NAME=Our Family Library
```

## Multi-User Features

Each family member can:
- Have their own account with unique username/email
- Mark books independently (you can mark "Read" while wife marks "Reading")
- Create personal shelves
- Rate and review books
- See family activity feed
- Track personal reading statistics

## Troubleshooting

### "Could not locate the bindings file"
```bash
npm rebuild better-sqlite3
```

### Database locked
Delete `library.db` and restart (note: this deletes all data)

### Port already in use
```bash
PORT=3002 npm run dev
```

---

Enjoy your family library! 📚
