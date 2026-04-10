import { NextRequest, NextResponse } from 'next/server';
import { find, findAll, insert, update } from '@/lib/db';
import { generateToken, hashPassword, comparePassword } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, username, email, password, displayName } = body;

    if (action === 'register') {
      if (!username || !email || !password || !displayName) {
        return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
      }

      const users = findAll<any>('users');
      const existing = users.find(u => u.username === username || u.email === email);
      if (existing) {
        return NextResponse.json({ error: 'Username or email already exists' }, { status: 400 });
      }

      const passwordHash = hashPassword(password);
      const colors = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'];
      const avatarColor = colors[Math.floor(Math.random() * colors.length)];
      const isAdmin = users.length === 0 ? 1 : 0;

      const result = insert('users', {
        username,
        email,
        password_hash: passwordHash,
        display_name: displayName,
        avatar_color: avatarColor,
        is_admin: isAdmin
      });

      const token = generateToken({ id: result.lastInsertRowid as number, username, isAdmin: !!isAdmin });

      return NextResponse.json({
        token,
        user: {
          id: result.lastInsertRowid,
          username,
          email,
          displayName,
          avatarColor,
          isAdmin: !!isAdmin
        }
      });
    }

    if (action === 'login') {
      if (!username || !password) {
        return NextResponse.json({ error: 'Username and password required' }, { status: 400 });
      }

      const users = findAll<any>('users');
      const user = users.find(u => u.username === username || u.email === username);
      
      if (!user) {
        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
      }

      if (!comparePassword(password, user.password_hash)) {
        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
      }

      const token = generateToken({ 
        id: user.id, 
        username: user.username, 
        isAdmin: !!user.is_admin 
      });

      return NextResponse.json({
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          displayName: user.display_name,
          avatarColor: user.avatar_color,
          isAdmin: !!user.is_admin
        }
      });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
}
