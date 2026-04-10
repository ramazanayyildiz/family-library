# 🚀 Family Library - Supabase Setup Guide

## Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project" or "New Project"
3. Fill in:
   - **Name**: family-library
   - **Database Password**: (save this!)
   - **Region**: Choose closest to you
4. Click "Create new project"

Wait 2-3 minutes for setup to complete.

---

## Step 2: Run Database Schema

1. In your Supabase dashboard, go to **SQL Editor** (left sidebar)
2. Click **"New query"**
3. Copy the entire content of `supabase-schema.sql` from this project
4. Paste it into the SQL editor
5. Click **"Run"** or press `Cmd/Ctrl + Enter`

You should see "Success. No rows returned" - this is correct!

---

## Step 3: Get Your API Keys

1. Go to **Settings** → **API** (left sidebar)
2. Make sure you're on **"Publishable and secret API keys"** tab (not Legacy)
3. Copy these values:
   - **Project URL** (top of page) → `NEXT_PUBLIC_SUPABASE_URL`
   - **Publishable key** → `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
   - **Secret key** (under Secret keys section) → `SUPABASE_SECRET_KEY`
   - ⚠️ **Never share the secret key publicly!**

---

## Step 4: Update Environment Variables

Open `.env.local` in your project:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...your-anon-key
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...your-service-role-key

# Optional: Google Books API (free)
# Get key from: https://console.cloud.google.com/apis/credentials
GOOGLE_BOOKS_API_KEY=your-google-books-key

NEXT_PUBLIC_APP_NAME=Our Family Library
```

---

## Step 5: (Optional) Google Books API Key

For better book data:

1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Click **"Create Credentials"** → **"API Key"**
3. Copy the API key
4. (Optional) Restrict it to "Books API" only
5. Add to `.env.local` as `GOOGLE_BOOKS_API_KEY`

**Note**: App works great without this too - it'll use Open Library as fallback!

---

## Step 6: Test It!

```bash
# Make sure you're in the project directory
cd library-app

# Start the dev server
npm run dev
```

Open http://localhost:3000

1. Click **"Get Started"**
2. Create your account
3. You'll be auto-logged in and redirected to dashboard!

---

## Step 7: Deploy to Production

### Deploy on Vercel (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

Follow the prompts:
1. Login to Vercel (GitHub recommended)
2. Import your project
3. Add environment variables (copy from `.env.local`)
4. Deploy!

Your app will be live at `https://your-app.vercel.app`

---

## Database Structure

Here's what the schema creates:

- **profiles** - User profiles (linked to Supabase auth)
- **books** - Book catalog
- **user_books** - Reading status per user (multi-user magic!)
- **shelves** - Custom collections
- **shelf_books** - Books in shelves
- **tags** - Book tags
- **book_tags** - Books tagged
- **family_settings** - App settings

---

## Features You Get

✅ **Email/Password Authentication** (via Supabase)
✅ **Multi-user support** - Family members can join
✅ **Independent tracking** - Each person marks their own progress
✅ **ISBN Lookup** - Google Books + Open Library
✅ **Real Database** - PostgreSQL (scales to millions of books!)
✅ **Row Level Security** - Users can only modify their own data
✅ **Auto Profile Creation** - Trigger creates profile on signup
✅ **First User = Admin** - Automatic admin detection

---

## Next Steps

1. **Invite your family** - They can sign up!
2. **Add books** - Use ISBN search or manual entry
3. **Mark your reading** - Track what you're reading
4. **Create shelves** - Organize your library
5. **Deploy** - Share with family!

---

## Troubleshooting

### "Invalid API key"
- Check your `.env.local` values
- Make sure you copied the full keys
- Restart dev server after changing env vars

### "Table doesn't exist"
- Run the SQL schema again
- Check SQL Editor for any errors

### Can't sign up
- Check browser console for errors
- Verify Supabase project is active
- Make sure email confirmation is disabled (or check spam)

---

## Need Help?

1. Check Supabase dashboard → Logs
2. Browser console for frontend errors
3. Terminal for backend errors

You got this! 📚🚀
