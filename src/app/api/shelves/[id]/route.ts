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

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const userId = getUserIdFromToken(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const shelfId = parseInt(id);
    const body = await request.json();
    const { action, bookId } = body;

    if (action === 'addBook') {
      // Check if already exists
      const existing = find<any>('shelfBooks', sb => sb.shelf_id === shelfId && sb.book_id === bookId);
      if (!existing) {
        insert('shelfBooks', { shelf_id: shelfId, book_id: bookId, position: 0 });
      }
    } else if (action === 'removeBook') {
      const existing = find<any>('shelfBooks', sb => sb.shelf_id === shelfId && sb.book_id === bookId);
      if (existing) {
        remove('shelfBooks', existing.id);
      }
    }

    const shelf = find<any>('shelves', s => s.id === shelfId);
    return NextResponse.json(shelf);
  } catch (error) {
    console.error('Update shelf error:', error);
    return NextResponse.json({ error: 'Failed to update shelf' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const userId = getUserIdFromToken(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const shelfId = parseInt(id);
    
    const shelf = find<any>('shelves', s => s.id === shelfId && s.user_id === userId);
    if (!shelf) {
      return NextResponse.json({ error: 'Shelf not found' }, { status: 404 });
    }

    // Remove shelf books first
    const shelfBooks = findAll<any>('shelfBooks').filter(sb => sb.shelf_id === shelfId);
    shelfBooks.forEach(sb => remove('shelfBooks', sb.id));

    remove('shelves', shelfId);
    return NextResponse.json({ message: 'Shelf deleted' });
  } catch (error) {
    console.error('Delete shelf error:', error);
    return NextResponse.json({ error: 'Failed to delete shelf' }, { status: 500 });
  }
}
