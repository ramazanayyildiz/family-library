import { NextRequest, NextResponse } from 'next/server';
import { find, findAll, insert, update, remove } from '@/lib/db';
import { verifyToken } from '@/lib/auth';

function getUserIdFromToken(request: NextRequest): number | null {
  const token = request.headers.get('authorization')?.replace('Bearer ', '');
  if (!token) return null;
  const decoded = verifyToken(token);
  if (!decoded) return null;
  return (decoded as any).id;
}

export async function GET(request: NextRequest) {
  try {
    const userId = getUserIdFromToken(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = request.nextUrl.searchParams;
    const search = db.get('search');
    const status = db.get('status');

    let books = findAll<any>('books');

    // Filter by search
    if (search) {
      const searchLower = search.toLowerCase();
      books = books.filter(b => 
        b.title?.toLowerCase().includes(searchLower) || 
        b.author?.toLowerCase().includes(searchLower) ||
        b.isbn?.toLowerCase().includes(searchLower)
      );
    }

    // Filter by user's status
    if (status) {
      const userBooks = findAll<any>('userBooks').filter(ub => ub.user_id === userId && ub.status === status);
      const bookIds = userBooks.map(ub => ub.book_id);
      books = books.filter(b => bookIds.includes(b.id));
    }

    // Sort by created_at DESC
    books.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    // Add user-specific data and tags
    const booksWithUserData = books.map(book => {
      const userBook = find<any>('userBooks', ub => ub.user_id === userId && ub.book_id === book.id);
      const bookTags = findAll<any>('bookTags').filter(bt => bt.book_id === book.id);
      const tagIds = bookTags.map(bt => bt.tag_id);
      const tags = tagIds.map(id => find<any>('tags', t => t.id === id)).filter(Boolean).map(t => t.name);

      return {
        ...book,
        tags,
        userStatus: userBook?.status || null,
        userRating: userBook?.rating || null,
        userReview: userBook?.review || null,
        dateStarted: userBook?.date_started || null,
        dateFinished: userBook?.date_finished || null
      };
    });

    return NextResponse.json(booksWithUserData);
  } catch (error) {
    console.error('Get books error:', error);
    return NextResponse.json({ error: 'Failed to get books' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = getUserIdFromToken(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { isbn, title, author, publisher, publishedYear, coverImage, description, pageCount, language, tags } = body;

    if (!title || !author) {
      return NextResponse.json({ error: 'Title and author are required' }, { status: 400 });
    }

    const result = insert('books', {
      isbn: isbn || null,
      title,
      author,
      publisher: publisher || null,
      published_year: publishedYear || null,
      cover_image: coverImage || null,
      description: description || null,
      page_count: pageCount || null,
      language: language || 'en',
      added_by: userId
    });

    // Add tags
    if (tags && tags.length > 0) {
      tags.forEach((tagName: string) => {
        let tag = find<any>('tags', t => t.name === tagName);
        if (!tag) {
          const colors = ['#6B7280', '#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6', '#EC4899'];
          const randomColor = colors[Math.floor(Math.random() * colors.length)];
          const tagResult = insert('tags', { name: tagName, color: randomColor });
          tag = { id: tagResult.lastInsertRowid };
        }
        insert('bookTags', { book_id: result.lastInsertRowid, tag_id: tag.id });
      });
    }

    const book = find<any>('books', b => b.id === result.lastInsertRowid);
    return NextResponse.json(book, { status: 201 });
  } catch (error) {
    console.error('Create book error:', error);
    return NextResponse.json({ error: 'Failed to create book' }, { status: 500 });
  }
}
