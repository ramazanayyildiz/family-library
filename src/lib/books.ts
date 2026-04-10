// Book data service - Fetches book info from multiple sources
const GOOGLE_BOOKS_URL = 'https://www.googleapis.com/books/v1/volumes';
const OPEN_LIBRARY_URL = 'https://openlibrary.org/isbn';

export interface BookData {
  isbn?: string;
  title?: string;
  subtitle?: string;
  author?: string;
  publisher?: string;
  publishedYear?: number;
  description?: string;
  coverImage?: string;
  pageCount?: number;
  language?: string;
  publishPlace?: string;
}

export async function fetchBookByISBN(isbn: string): Promise<BookData | null> {
  const cleanISBN = isbn.replace(/[^0-9X]/g, '');

  // Try Google Books first (if API key available)
  if (process.env.GOOGLE_BOOKS_API_KEY) {
    try {
      const googleResult = await fetchFromGoogleBooks(cleanISBN);
      if (googleResult) return googleResult;
    } catch (error) {
      console.log('Google Books failed, trying Open Library:', error);
    }
  }

  // Fallback to Open Library
  try {
    const openLibraryResult = await fetchFromOpenLibrary(cleanISBN);
    if (openLibraryResult) return openLibraryResult;
  } catch (error) {
    console.error('Open Library also failed:', error);
  }

  return null;
}

async function fetchFromGoogleBooks(isbn: string): Promise<BookData | null> {
  const apiKey = process.env.GOOGLE_BOOKS_API_KEY;
  const url = `${GOOGLE_BOOKS_URL}?q=isbn:${isbn}&key=${apiKey}`;

  const response = await fetch(url);
  if (!response.ok) return null;

  const data = await response.json();
  if (!data.items || data.items.length === 0) return null;

  const volume = data.items[0].volumeInfo;

  return {
    title: volume.title,
    subtitle: volume.subtitle,
    author: volume.authors?.join(', '),
    publisher: volume.publisher,
    publishedYear: volume.publishedDate?.split('-')[0] ? parseInt(volume.publishedDate.split('-')[0]) : undefined,
    description: volume.description,
    coverImage: volume.imageLinks?.large || volume.imageLinks?.medium || volume.imageLinks?.small,
    pageCount: volume.pageCount,
    language: volume.language || 'en',
    isbn: isbn
  };
}

async function fetchFromOpenLibrary(isbn: string): Promise<BookData | null> {
  const response = await fetch(`${OPEN_LIBRARY_URL}/${isbn}.json`);
  if (!response.ok) return null;

  const data = await response.json();

  // Parse authors - can be array of objects with name or key
  let authors = '';
  if (data.authors) {
    if (Array.isArray(data.authors)) {
      authors = data.authors
        .map((a: any) => {
          if (typeof a === 'string') return a;
          if (a.name) return a.name;
          if (a.key) return a.key.split('/').pop(); // Extract from /authors/OL26320A
          return '';
        })
        .filter(Boolean)
        .join(', ');
    } else if (typeof data.authors === 'string') {
      authors = data.authors;
    }
  }

  // Get cover image
  let coverImage = '';
  if (data.covers && Array.isArray(data.covers) && data.covers.length > 0) {
    const coverId = data.covers[0];
    coverImage = `https://covers.openlibrary.org/b/id/${coverId}-L.jpg`;
  } else if (data.cover) {
    coverImage = data.cover.large || data.cover.medium || data.cover.small;
  }

  // Parse language
  let language = 'en';
  if (data.languages) {
    if (Array.isArray(data.languages) && data.languages.length > 0) {
      language = data.languages[0].key?.replace('/languages/', '') || 'en';
    } else if (typeof data.languages === 'string') {
      language = data.languages;
    }
  }

  // Parse publish date - can be year or full date
  let publishedYear: number | undefined;
  if (data.first_publish_date) {
    publishedYear = parseInt(data.first_publish_date.split('-')[0]);
  } else if (data.publish_date) {
    publishedYear = parseInt(data.publish_date.split('-')[0]);
    if (isNaN(publishedYear)) {
      publishedYear = parseInt(data.publish_date);
    }
  }

  // Get ISBNs
  const isbn10 = data.isbn_10?.[0];
  const isbn13 = data.isbn_13?.[0];

  return {
    title: data.title,
    subtitle: data.subtitle,
    author: authors,
    publisher: data.publishers?.[0],
    publishPlace: data.publish_places?.[0],
    publishedYear: publishedYear,
    description: data.excerpts?.[0]?.text || data.notes,
    coverImage: coverImage,
    pageCount: data.number_of_pages || data.pagination ? parseInt(String(data.number_of_pages || data.pagination).replace(/[^0-9]/g, '')) : undefined,
    language: language,
    isbn: isbn13 || isbn10 || isbn
  };
}

export async function searchBooks(query: string): Promise<BookData[]> {
  const apiKey = process.env.GOOGLE_BOOKS_API_KEY;
  const url = `${GOOGLE_BOOKS_URL}?q=${encodeURIComponent(query)}&maxResults=10${apiKey ? `&key=${apiKey}` : ''}`;

  try {
    const response = await fetch(url);
    if (!response.ok) return [];

    const data = await response.json();
    if (!data.items) return [];

    return data.items.map((item: any) => {
      const volume = item.volumeInfo;
      return {
        title: volume.title,
        subtitle: volume.subtitle,
        author: volume.authors?.join(', '),
        publisher: volume.publisher,
        publishedYear: volume.publishedDate?.split('-')[0],
        description: volume.description,
        coverImage: volume.imageLinks?.thumbnail,
        pageCount: volume.pageCount,
        language: volume.language || 'en',
        isbn: volume.industryIdentifiers?.[0]?.identifier
      };
    });
  } catch {
    return [];
  }
}
