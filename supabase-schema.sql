-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  avatar_color TEXT DEFAULT '#3B82F6',
  is_admin BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Books table
CREATE TABLE IF NOT EXISTS public.books (
  id BIGSERIAL PRIMARY KEY,
  isbn TEXT,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  publisher TEXT,
  published_year INTEGER,
  cover_image TEXT,
  description TEXT,
  page_count INTEGER,
  language TEXT DEFAULT 'en',
  added_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User books (reading status, reviews, etc.)
CREATE TABLE IF NOT EXISTS public.user_books (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  book_id BIGINT REFERENCES public.books(id) ON DELETE CASCADE NOT NULL,
  status TEXT DEFAULT 'towatch' CHECK (status IN ('towatch', 'reading', 'read', 'abandoned')),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  review TEXT,
  date_started TIMESTAMPTZ,
  date_finished TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, book_id)
);

-- Shelves (custom collections)
CREATE TABLE IF NOT EXISTS public.shelves (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Shelf books (many-to-many)
CREATE TABLE IF NOT EXISTS public.shelf_books (
  id BIGSERIAL PRIMARY KEY,
  shelf_id BIGINT REFERENCES public.shelves(id) ON DELETE CASCADE NOT NULL,
  book_id BIGINT REFERENCES public.books(id) ON DELETE CASCADE NOT NULL,
  position INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(shelf_id, book_id)
);

-- Tags
CREATE TABLE IF NOT EXISTS public.tags (
  id BIGSERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  color TEXT DEFAULT '#6B7280'
);

-- Book tags (many-to-many)
CREATE TABLE IF NOT EXISTS public.book_tags (
  id BIGSERIAL PRIMARY KEY,
  book_id BIGINT REFERENCES public.books(id) ON DELETE CASCADE NOT NULL,
  tag_id BIGINT REFERENCES public.tags(id) ON DELETE CASCADE NOT NULL,
  UNIQUE(book_id, tag_id)
);

-- Family settings
CREATE TABLE IF NOT EXISTS public.family_settings (
  id BIGSERIAL PRIMARY KEY,
  family_name TEXT DEFAULT 'Our Library',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default family settings
INSERT INTO public.family_settings (family_name) VALUES ('Our Family Library')
ON CONFLICT DO NOTHING;

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_books_title ON books(title);
CREATE INDEX IF NOT EXISTS idx_books_author ON books(author);
CREATE INDEX IF NOT EXISTS idx_books_isbn ON books(isbn);
CREATE INDEX IF NOT EXISTS idx_user_books_user ON user_books(user_id);
CREATE INDEX IF NOT EXISTS idx_user_books_book ON user_books(book_id);
CREATE INDEX IF NOT EXISTS idx_user_books_status ON user_books(status);
CREATE INDEX IF NOT EXISTS idx_shelves_user ON shelves(user_id);
CREATE INDEX IF NOT EXISTS idx_shelf_books_shelf ON shelf_books(shelf_id);
CREATE INDEX IF NOT EXISTS idx_book_tags_book ON book_tags(book_id);
CREATE INDEX IF NOT EXISTS idx_profiles_username ON profiles(username);

-- Row Level Security Policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_books ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shelves ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shelf_books ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.book_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.family_settings ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Books policies
CREATE POLICY "Users can view all books" ON public.books FOR SELECT USING (true);
CREATE POLICY "Users can insert books" ON public.books FOR INSERT WITH CHECK (auth.uid() = added_by);
CREATE POLICY "Users can update books they added" ON public.books FOR UPDATE USING (auth.uid() = added_by);
CREATE POLICY "Users can delete books they added" ON public.books FOR DELETE USING (auth.uid() = added_by);

-- User books policies
CREATE POLICY "Users can view own user_books" ON public.user_books FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own user_books" ON public.user_books FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own user_books" ON public.user_books FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own user_books" ON public.user_books FOR DELETE USING (auth.uid() = user_id);

-- Shelves policies
CREATE POLICY "Users can view own shelves" ON public.shelves FOR SELECT USING (auth.uid() = user_id OR is_public = true);
CREATE POLICY "Users can insert own shelves" ON public.shelves FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own shelves" ON public.shelves FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own shelves" ON public.shelves FOR DELETE USING (auth.uid() = user_id);

-- Shelf books policies
CREATE POLICY "Users can view shelf books for accessible shelves" ON public.shelf_books FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.shelves WHERE id = shelf_books.shelf_id AND (user_id = auth.uid() OR is_public = true))
);
CREATE POLICY "Users can manage own shelf books" ON public.shelf_books FOR ALL USING (
  EXISTS (SELECT 1 FROM public.shelves WHERE id = shelf_books.shelf_id AND user_id = auth.uid())
);

-- Tags policies
CREATE POLICY "Users can view all tags" ON public.tags FOR SELECT USING (true);
CREATE POLICY "Users can insert tags" ON public.tags FOR INSERT WITH CHECK (true);

-- Book tags policies
CREATE POLICY "Users can view all book_tags" ON public.book_tags FOR SELECT USING (true);
CREATE POLICY "Users can manage book_tags" ON public.book_tags FOR ALL USING (true);

-- Family settings policies
CREATE POLICY "Users can view family settings" ON public.family_settings FOR SELECT USING (true);

-- Function to create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, display_name, avatar_color, is_admin)
  SELECT 
    NEW.id,
    NEW.raw_user_meta_data->>'username',
    NEW.raw_user_meta_data->>'display_name',
    COALESCE(NEW.raw_user_meta_data->>'avatar_color', '#3B82F6'),
    (SELECT COUNT(*) = 0 FROM public.profiles)
  ;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_books_updated_at BEFORE UPDATE ON public.books FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_user_books_updated_at BEFORE UPDATE ON public.user_books FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
