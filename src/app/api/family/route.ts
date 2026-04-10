import { NextRequest, NextResponse } from 'next/server';
import { findAll } from '@/lib/db';

export async function GET() {
  try {
    const members = findAll<any>('users').sort((a, b) => a.display_name?.localeCompare(b.display_name));

    return NextResponse.json(members.map(m => ({
      id: m.id,
      username: m.username,
      displayName: m.display_name,
      avatarColor: m.avatar_color,
      isAdmin: !!m.is_admin,
      createdAt: m.created_at
    })));
  } catch (error) {
    console.error('Get family error:', error);
    return NextResponse.json({ error: 'Failed to get family members' }, { status: 500 });
  }
}
