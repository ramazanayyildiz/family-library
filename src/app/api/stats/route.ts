import { NextRequest, NextResponse } from 'next/server';
import { find, findAll } from '@/lib/db';
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

    const users = findAll<any>('users');
    const books = findAll<any>('books');
    const userBooks = findAll<any>('userBooks');

    const stats = {
      totalBooks: books.length,
      myBooks: userBooks.filter(ub => ub.user_id === userId).length,
      readBooks: userBooks.filter(ub => ub.user_id === userId && ub.status === 'read').length,
      readingBooks: userBooks.filter(ub => ub.user_id === userId && ub.status === 'reading').length,
      toReadBooks: userBooks.filter(ub => ub.user_id === userId && ub.status === 'towatch').length,
      familyMembers: users.length,
    };

    // Get recent activity
    const recentActivity = userBooks
      .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
      .slice(0, 10)
      .map(ub => {
        const user = find<any>('users', u => u.id === ub.user_id);
        const book = find<any>('books', b => b.id === ub.book_id);
        return {
          display_name: user?.display_name,
          avatar_color: user?.avatar_color,
          title: book?.title,
          book_id: ub.book_id,
          status: ub.status,
          updated_at: ub.updated_at
        };
      });

    return NextResponse.json({
      totalBooks: stats.totalBooks,
      myBooks: stats.myBooks,
      readBooks: stats.readBooks,
      readingBooks: stats.readingBooks,
      toReadBooks: stats.toReadBooks,
      familyMembers: stats.familyMembers,
      recentActivity
    });
  } catch (error) {
    console.error('Get stats error:', error);
    return NextResponse.json({ error: 'Failed to get stats' }, { status: 500 });
  }
}
