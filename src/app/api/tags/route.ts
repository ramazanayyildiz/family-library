import { NextRequest, NextResponse } from 'next/server';
import { find, findAll, insert } from '@/lib/db';

export async function GET() {
  try {
    const tags = findAll<any>('tags').sort((a, b) => a.name?.localeCompare(b.name));
    const tagsWithCount = tags.map(tag => ({
      ...tag,
      book_count: findAll<any>('bookTags').filter(bt => bt.tag_id === tag.id).length
    }));

    return NextResponse.json(tagsWithCount);
  } catch (error) {
    console.error('Get tags error:', error);
    return NextResponse.json({ error: 'Failed to get tags' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, color } = body;

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    const existing = find<any>('tags', t => t.name === name);
    if (existing) {
      return NextResponse.json({ error: 'Tag already exists' }, { status: 400 });
    }

    const colors = ['#6B7280', '#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6', '#EC4899', '#06B6D4'];
    const tagColor = color || colors[Math.floor(Math.random() * colors.length)];

    const result = insert('tags', { name, color: tagColor });
    const tag = find<any>('tags', t => t.id === result.lastInsertRowid);
    
    return NextResponse.json(tag, { status: 201 });
  } catch (error) {
    console.error('Create tag error:', error);
    return NextResponse.json({ error: 'Failed to create tag' }, { status: 500 });
  }
}
