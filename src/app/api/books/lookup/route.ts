import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { fetchBookByISBN } from '@/lib/books';

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient();
    const body = await request.json();
    const { action, isbn } = body;

    if (action === 'lookup') {
      if (!isbn) {
        return NextResponse.json({ error: 'ISBN is required' }, { status: 400 });
      }

      // Fetch book data from external APIs
      const bookData = await fetchBookByISBN(isbn);

      if (!bookData) {
        return NextResponse.json({ 
          found: false, 
          isbn,
          message: 'Book not found. Please enter details manually.' 
        });
      }

      // Check if book already exists in database
      const { data: existing } = await supabase
        .from('books')
        .select('id, title, author')
        .eq('isbn', isbn)
        .single();

      if (existing) {
        return NextResponse.json({ 
          found: true, 
          exists: true,
          book: existing 
        });
      }

      return NextResponse.json({ 
        found: true, 
        exists: false,
        book: bookData 
      });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Books API error:', error);
    return NextResponse.json({ error: 'Failed to lookup book' }, { status: 500 });
  }
}
