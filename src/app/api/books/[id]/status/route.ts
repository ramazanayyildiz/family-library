import { NextRequest, NextResponse } from 'next/server';
import { find, insert, update, findAll } from '@/lib/db';
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
    const bookId = parseInt(id);
    const body = await request.json();
    const { status, rating, review, dateStarted, dateFinished, notes } = body;

    if (!status) {
      return NextResponse.json({ error: 'Status is required' }, { status: 400 });
    }

    const existing = find<any>('userBooks', ub => ub.user_id === userId && ub.book_id === bookId);

    if (existing) {
      update('userBooks', existing.id, {
        status,
        rating: rating || null,
        review: review || null,
        date_started: dateStarted || null,
        date_finished: dateFinished || null,
        notes: notes || null
      });
    } else {
      insert('userBooks', {
        user_id: userId,
        book_id: bookId,
        status,
        rating: rating || null,
        review: review || null,
        date_started: dateStarted || null,
        date_finished: dateFinished || null,
        notes: notes || null
      });
    }

    return NextResponse.json({ message: 'Status updated successfully' });
  } catch (error) {
    console.error('Update status error:', error);
    return NextResponse.json({ error: 'Failed to update status' }, { status: 500 });
  }
}
