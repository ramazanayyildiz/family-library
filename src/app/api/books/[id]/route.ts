import { NextRequest, NextResponse } from 'next/server';
import { find, findAll, update, remove } from '@/lib/db';
import { verifyToken } from '@/lib/auth';

function getUserIdFromToken(request: NextRequest): number | null {
  const token = request.headers.get('authorization')?.replace('Bearer ', '');
  if (!token) return null;
  const decoded = verifyToken(token);
  if (!decoded) return null;
  return (decoded as any).id;
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const userId = getUserIdFromToken(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const bookId = parseInt(id);
    
    const book = find<any>('books', b => b.id === bookId);
    if (!book) {
      return NextResponse.json({ error: 'Book not found' }, { status: 404 });
    }

    const userBook = find<any>('userBooks', ub => ub.user_id === userId && ub.book_id === bookId);
    
    const bookTags = findAll<any>('bookTags').filter(bt => bt.book_id === bookId);
    const tagIds = bookTags.map(bt => bt.tag_id);
    const tags = tagIds.map(id => find<any>('tags', t => t.id === id)).filter(Boolean).map(t => t.name);

    const familyReaders = findAll<any>('userBooks')
      .filter(ub => ub.book_id === bookId)
      .map(ub => {
        const user = find<any>('users', u => u.id === ub.user_id);
        return {
          display_name: user?.display_name,
          avatar_color: user?.avatar_color,
          status: ub.status,
          rating: ub.rating,
          date_finished: ub.date_finished
        };
      });

    return NextResponse.json({
      ...book,
      tags,
      userStatus: userBook?.status || null,
      userRating: userBook?.rating || null,
      userReview: userBook?.review || null,
      dateStarted: userBook?.date_started || null,
      dateFinished: userBook?.date_finished || null,
      familyReaders
    });
  } catch (error) {
    console.error('Get book error:', error);
    return NextResponse.json({ error: 'Failed to get book' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const userId = getUserIdFromToken(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const bookId = parseInt(id);
    const body = await request.json();
    const { isbn, title, author, publisher, publishedYear, coverImage, description, pageCount, language, tags } = body;

    const existing = find<any>('books', b => b.id === bookId);
    if (!existing) {
      return NextResponse.json({ error: 'Book not found' }, { status: 404 });
    }

    update('books', bookId, {
      isbn: isbn || null,
      title: title || existing.title,
      author: author || existing.author,
      publisher: publisher || null,
      published_year: publishedYear || null,
      cover_image: coverImage || null,
      description: description || null,
      page_count: pageCount || null,
      language: language || 'en'
    });

    if (tags !== undefined) {
      // Remove existing tags
      const existingTags = findAll<any>('bookTags').filter(bt => bt.book_id === bookId);
      existingTags.forEach(et => remove('bookTags', et.id));
      
      // Add new tags
      tags.forEach((tagName: string) => {
        let tag = find<any>('tags', t => t.name === tagName);
        if (!tag) {
          const colors = ['#6B7280', '#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6', '#EC4899'];
          const randomColor = colors[Math.floor(Math.random() * colors.length)];
          const tagResult = insert('tags', { name: tagName, color: randomColor });
          tag = { id: tagResult.lastInsertRowid };
        }
        insert('bookTags', { book_id: bookId, tag_id: tag.id });
      });
    }

    const book = find<any>('books', b => b.id === bookId);
    return NextResponse.json(book);
  } catch (error) {
    console.error('Update book error:', error);
    return NextResponse.json({ error: 'Failed to update book' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const bookId = parseInt(id);
    
    const existing = find<any>('books', b => b.id === bookId);
    if (!existing) {
      return NextResponse.json({ error: 'Book not found' }, { status: 404 });
    }

    remove('books', bookId);
    return NextResponse.json({ message: 'Book deleted successfully' });
  } catch (error) {
    console.error('Delete book error:', error);
    return NextResponse.json({ error: 'Failed to delete book' }, { status: 500 });
  }
}
