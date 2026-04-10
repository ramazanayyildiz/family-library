import { NextRequest, NextResponse } from 'next/server';
import { find, findAll, insert, remove } from '@/lib/db';
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

    const shelves = findAll<any>('shelves').filter(s => s.user_id === userId);
    
    const shelvesWithBooks = shelves.map(shelf => ({
      ...shelf,
      book_count: findAll<any>('shelfBooks').filter(sb => sb.shelf_id === shelf.id).length,
      books: findAll<any>('shelfBooks').filter(sb => sb.shelf_id === shelf.id).map(sb => sb.book_id)
    }));

    return NextResponse.json(shelvesWithBooks);
  } catch (error) {
    console.error('Get shelves error:', error);
    return NextResponse.json({ error: 'Failed to get shelves' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = getUserIdFromToken(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, description, isPublic } = body;

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    const result = insert('shelves', {
      name,
      description: description || null,
      user_id: userId,
      is_public: isPublic ? 1 : 0
    });

    const shelf = find<any>('shelves', s => s.id === result.lastInsertRowid);
    return NextResponse.json(shelf, { status: 201 });
  } catch (error) {
    console.error('Create shelf error:', error);
    return NextResponse.json({ error: 'Failed to create shelf' }, { status: 500 });
  }
}
