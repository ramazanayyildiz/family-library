'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { BookOpen, Search, Plus, Filter, X } from 'lucide-react';
import Link from 'next/link';

interface Book {
  id: number;
  title: string;
  author: string;
  isbn?: string;
  coverImage?: string;
  userStatus?: string;
  userRating?: number;
  tags: string[];
  addedByName?: string;
}

export default function BooksPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [books, setBooks] = useState<Book[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (user) {
      fetchBooks();
    }
  }, [user, search, statusFilter]);

  async function fetchBooks() {
    try {
      const token = localStorage.getItem('token');
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (statusFilter && statusFilter !== 'all') params.append('status', statusFilter);

      const res = await fetch(`/api/books?${params}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setBooks(data);
      }
    } catch (error) {
      console.error('Failed to fetch books:', error);
    } finally {
      setIsLoaded(true);
    }
  }

  function getStatusColor(status?: string) {
    switch (status) {
      case 'read': return 'bg-green-100 text-green-800';
      case 'reading': return 'bg-blue-100 text-blue-800';
      case 'towatch': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  function getStatusLabel(status?: string) {
    switch (status) {
      case 'read': return 'Read';
      case 'reading': return 'Reading';
      case 'towatch': return 'Want to Read';
      default: return 'Not Set';
    }
  }

  if (isLoading || !isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
                <BookOpen className="w-6 h-6" />
              </Link>
              <h1 className="text-xl font-semibold text-gray-900">Library</h1>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`p-2 rounded-lg ${showFilters ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <Filter className="w-5 h-5" />
              </button>
              <Link href="/books/add" className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                <Plus className="w-5 h-5 mr-2" />
                Add Book
              </Link>
            </div>
          </div>

          {/* Search */}
          <div className="mt-4 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title, author, or ISBN..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="mt-4 flex flex-wrap gap-2">
              {['all', 'towatch', 'reading', 'read'].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                    statusFilter === status
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {status === 'all' ? 'All Books' : getStatusLabel(status)}
                </button>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* Book Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {books.length === 0 ? (
          <div className="text-center py-16">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No books found</h3>
            <p className="text-gray-500 mb-6">Start building your family library!</p>
            <Link href="/books/add" className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <Plus className="w-5 h-5 mr-2" />
              Add Your First Book
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {books.map((book) => (
              <BookCard key={book.id} book={book} onStatusChange={fetchBooks} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function BookCard({ book, onStatusChange }: { book: Book; onStatusChange: () => void }) {
  const [showStatusMenu, setShowStatusMenu] = useState(false);

  function getStatusColor(status?: string) {
    switch (status) {
      case 'read': return 'bg-green-100 text-green-800';
      case 'reading': return 'bg-blue-100 text-blue-800';
      case 'towatch': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  function getStatusLabel(status?: string) {
    switch (status) {
      case 'read': return 'Read';
      case 'reading': return 'Reading';
      case 'towatch': return 'Want to Read';
      default: return 'Not Set';
    }
  }

  async function updateStatus(status: string) {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/books/${book.id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });

      if (res.ok) {
        onStatusChange();
      }
    } catch (error) {
      console.error('Failed to update status:', error);
    }
    setShowStatusMenu(false);
  }

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition">
      <div className="aspect-[3/4] bg-gray-100 relative">
        {book.coverImage ? (
          <img src={book.coverImage} alt={book.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <BookOpen className="w-16 h-16 text-gray-300" />
          </div>
        )}
        <div className="absolute top-2 right-2">
          <button
            onClick={() => setShowStatusMenu(!showStatusMenu)}
            className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(book.userStatus)}`}
          >
            {getStatusLabel(book.userStatus)}
          </button>
          {showStatusMenu && (
            <div className="absolute right-0 mt-2 bg-white rounded-lg shadow-lg border py-2 z-10 min-w-[150px]">
              <button onClick={() => updateStatus('towatch')} className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50">
                Want to Read
              </button>
              <button onClick={() => updateStatus('reading')} className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50">
                Reading
              </button>
              <button onClick={() => updateStatus('read')} className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50">
                Read
              </button>
              <button onClick={() => updateStatus('abandoned')} className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50">
                Abandoned
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 truncate mb-1">{book.title}</h3>
        <p className="text-sm text-gray-600 truncate mb-2">{book.author}</p>
        {book.tags && book.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {book.tags.slice(0, 3).map((tag, idx) => (
              <span key={idx} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
