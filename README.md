# 📚 Family Library App

A **production-ready**, multi-user library management application for families. Built with Next.js 16 and Supabase (PostgreSQL).

![Features](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![Database](https://img.shields.io/badge/Database-PostgreSQL-blue?logo=postgresql)
![Auth](https://img.shields.io/badge/Auth-Supabase-green?logo=supabase)
![Deploy](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel)

---

## ✨ Features

### Multi-User System
- Each family member has their own account
- Independent reading tracking (you can mark "Read" while wife marks "Reading")
- Family activity feed
- Role-based access (first user = admin)

### Book Management
- **ISBN Lookup** - Auto-fetch book data from Google Books & Open Library
- Manual book entry
- Cover images, descriptions, metadata
- Tags and custom shelves

### Reading Tracker
- Status: Want to Read → Reading → Read → Abandoned
- 5-star ratings & reviews
- Reading dates (started/finished)
- Personal notes

### Organization
- Custom shelves (e.g., "Dad's Favorites", "Kids Books")
- Tags with colors
- Search by title, author, ISBN
- Filter by reading status

### Production Ready
- PostgreSQL database (Supabase)
- Secure authentication (Supabase Auth)
- Row Level Security policies
- Scalable to millions of books
- Free hosting on Vercel

---

## 🚀 Quick Start

### 1. Setup Supabase (5 minutes)

```bash
# 1. Go to supabase.com and create free account
# 2. Create new project
# 3. Run supabase-schema.sql in SQL Editor
# 4. Copy API keys to .env.local
```

See [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) for detailed instructions.

### 2. Run Locally

```bash
npm install
npm run dev
```

Open http://localhost:3000

### 3. Deploy to Production

```bash
npm install -g vercel
vercel
```

Add your Supabase keys when prompted.

---

## 🛠️ Tech Stack

- **Frontend**: Next.js 16 (App Router, TypeScript)
- **Backend**: Supabase (PostgreSQL + Auth)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Deployment**: Vercel
- **Book Data**: Google Books API + Open Library

---

## 📁 Project Structure

```
library-app/
├── src/
│   ├── app/
│   │   ├── api/              # API routes
│   │   │   ├── auth/         # Supabase auth
│   │   │   ├── books/        # Books CRUD + ISBN lookup
│   │   │   ├── shelves/      # Shelves management
│   │   │   ├── tags/         # Tags
│   │   │   └── stats/        # Statistics
│   │   ├── login/            # Login page
│   │   ├── register/         # Registration page
│   │   ├── dashboard/        # User dashboard
│   │   ├── books/            # Books pages
│   │   └── shelves/          # Shelves page
│   ├── contexts/
│   │   └── AuthContext.tsx   # Auth context
│   ├── lib/
│   │   ├── supabase.ts       # Supabase client
│   │   ├── books.ts          # ISBN lookup service
│   │   └── db.ts             # (legacy JSON db)
│   └── __tests__/            # Tests
├── supabase-schema.sql       # Database schema
├── .env.local                # Environment variables
└── README.md                 # This file
```

---

## 🔐 Environment Variables

```env
# Required: Supabase (New API Keys)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
SUPABASE_SECRET_KEY=your-secret-key

# Optional: Google Books API (free)
GOOGLE_BOOKS_API_KEY=your-google-books-key

# App
NEXT_PUBLIC_APP_NAME=Our Family Library
```

---

## 📊 Database Schema

The app creates these tables:

- **profiles** - User profiles (auto-created on signup)
- **books** - Book catalog
- **user_books** - Reading status per user
- **shelves** - Custom collections
- **shelf_books** - Books in shelves
- **tags** - Book tags
- **book_tags** - Books tagged
- **family_settings** - App settings

All tables have Row Level Security (RLS) policies for data protection.

---

## 🧪 Testing

```bash
npm test
npm run test:watch
```

---

## 📱 Mobile App

The web app is mobile-responsive and works great on phones! 

For a native mobile app with camera scanning:
- Flutter app can use the same Supabase backend
- API endpoints are ready
- ISBN scanning uses phone camera

---

## 🌟 Key Features for Families

### What Makes It Special?

1. **Independent Tracking**: Each family member tracks their own progress on the same books
2. **Shared Library**: All books are visible to everyone
3. **Privacy**: Your reviews and ratings are private to you
4. **Activity Feed**: See what everyone is reading in real-time
5. **Scales**: From 10 books to 10,000 books

### Example Use Cases

- **Dad** marks "The Hobbit" as ⭐⭐⭐⭐⭐ Read
- **Mom** marks same book as 📖 Reading
- **Kid** marks it as 📚 Want to Read
- Everyone sees each other's progress!

---

## 🎯 Roadmap

- [ ] Email invitations for family members
- [ ] Book cover image upload
- [ ] Reading challenges
- [ ] Export library to CSV
- [ ] Mobile app (Flutter)
- [ ] Dark mode
- [ ] Reading statistics & charts

---

## 🤝 Contributing

This is open source! Feel free to:
- Report bugs
- Suggest features
- Submit PRs

---

## 📄 License

MIT License - Free for personal and commercial use

---

## 🙏 Acknowledgments

- Book data: [Google Books API](https://developers.google.com/books) & [Open Library](https://openlibrary.org/)
- Icons: [Lucide](https://lucide.dev/)
- Hosting: [Vercel](https://vercel.com/)
- Database: [Supabase](https://supabase.com/)

---

**Built with ❤️ for families who love reading together**

Start your family library today: [QUICKSTART.md](./QUICKSTART.md)
