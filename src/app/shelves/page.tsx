'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { List, Plus, BookOpen, Trash2, X } from 'lucide-react';
import Link from 'next/link';

interface Shelf {
  id: number;
  name: string;
  description?: string;
  books: number[];
}

interface Book {
  id: number;
  title: string;
  author: string;
}

export default function ShelvesPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [shelves, setShelves] = useState<Shelf[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAddBookModal, setShowAddBookModal] = useState(false);
  const [selectedShelf, setSelectedShelf] = useState<Shelf | null>(null);
  const [newShelfName, setNewShelfName] = useState('');
  const [newShelfDescription, setNewShelfDescription] = useState('');

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (user) {
      fetchShelves();
      fetchBooks();
    }
  }, [user]);

  async function fetchShelves() {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/shelves', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setShelves(data);
      }
    } catch (error) {
      console.error('Failed to fetch shelves:', error);
    }
  }

  async function fetchBooks() {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/books', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setBooks(data);
      }
    } catch (error) {
      console.error('Failed to fetch books:', error);
    }
  }

  async function createShelf() {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/shelves', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          name: newShelfName,
          description: newShelfDescription
        })
      });

      if (res.ok) {
        setNewShelfName('');
        setNewShelfDescription('');
        setShowCreateModal(false);
        fetchShelves();
      }
    } catch (error) {
      console.error('Failed to create shelf:', error);
    }
  }

  async function deleteShelf(shelfId: number) {
    if (!confirm('Are you sure you want to delete this shelf?')) return;

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/shelves/${shelfId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (res.ok) {
        fetchShelves();
      }
    } catch (error) {
      console.error('Failed to delete shelf:', error);
    }
  }

  async function addBookToShelf(bookId: number) {
    if (!selectedShelf) return;

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/shelves/${selectedShelf.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          action: 'addBook',
          bookId
        })
      });

      if (res.ok) {
        setShowAddBookModal(false);
        fetchShelves();
      }
    } catch (error) {
      console.error('Failed to add book:', error);
    }
  }

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
                <List className="w-6 h-6" />
              </Link>
              <h1 className="text-xl font-semibold text-gray-900">My Shelves</h1>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus className="w-5 h-5 mr-2" />
              New Shelf
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {shelves.length === 0 ? (
          <div className="text-center py-16">
            <List className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No shelves yet</h3>
            <p className="text-gray-500 mb-6">Create your first book collection!</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create Shelf
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {shelves.map((shelf) => (
              <div key={shelf.id} className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg">{shelf.name}</h3>
                    {shelf.description && (
                      <p className="text-sm text-gray-500 mt-1">{shelf.description}</p>
                    )}
                  </div>
                  <button
                    onClick={() => deleteShelf(shelf.id)}
                    className="text-gray-400 hover:text-red-600"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-600">
                    <BookOpen className="w-4 h-4 mr-2" />
                    {shelf.books.length} books
                  </div>
                  <button
                    onClick={() => {
                      setSelectedShelf(shelf);
                      setShowAddBookModal(true);
                    }}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    + Add Book
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Create Shelf Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Create New Shelf</h2>
              <button onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Shelf Name
                </label>
                <input
                  type="text"
                  value={newShelfName}
                  onChange={(e) => setNewShelfName(e.target.value)}
                  placeholder="e.g., Summer Reading 2024"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description (optional)
                </label>
                <textarea
                  value={newShelfDescription}
                  onChange={(e) => setNewShelfDescription(e.target.value)}
                  placeholder="Describe this shelf..."
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={createShelf}
                  disabled={!newShelfName.trim()}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Book Modal */}
      {showAddBookModal && selectedShelf && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 max-h-[80vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Add Book to "{selectedShelf.name}"</h2>
              <button onClick={() => setShowAddBookModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto space-y-2">
              {books
                .filter((book) => !selectedShelf.books.includes(book.id))
                .map((book) => (
                  <button
                    key={book.id}
                    onClick={() => addBookToShelf(book.id)}
                    className="w-full p-3 text-left hover:bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <p className="font-medium text-gray-900">{book.title}</p>
                    <p className="text-sm text-gray-500">{book.author}</p>
                  </button>
                ))}
              {books.filter((book) => !selectedShelf.books.includes(book.id)).length === 0 && (
                <p className="text-center text-gray-500 py-8">No more books to add</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
