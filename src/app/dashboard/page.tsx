'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { BookOpen, Users, BookMarked, List, Plus, LogOut, BarChart3 } from 'lucide-react';
import Link from 'next/link';

interface Stats {
  totalBooks: number;
  myBooks: number;
  readBooks: number;
  readingBooks: number;
  toReadBooks: number;
  familyMembers: number;
  recentActivity: any[];
}

export default function DashboardPage() {
  const { user, profile, loading, logout } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      fetchStats();
    }
  }, [user]);

  async function fetchStats() {
    try {
      const token = (await user.getIdToken()).token;
      const res = await fetch('/api/stats', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setIsLoaded(true);
    }
  }

  if (loading || !isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || !profile) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg" style={{ backgroundColor: profile.avatarColor }}>
                {profile.displayName[0].toUpperCase()}
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Welcome, {profile.displayName}!</h1>
                <p className="text-sm text-gray-500">Family Library</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/books" className="text-gray-600 hover:text-gray-900">
                <BookOpen className="w-6 h-6" />
              </Link>
              <Link href="/shelves" className="text-gray-600 hover:text-gray-900">
                <List className="w-6 h-6" />
              </Link>
              <button onClick={logout} className="text-gray-600 hover:text-gray-900">
                <LogOut className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <BookOpen className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats?.totalBooks || 0}</p>
            <p className="text-sm text-gray-500">Total Books</p>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <BookMarked className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats?.myBooks || 0}</p>
            <p className="text-sm text-gray-500">My Books</p>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <BarChart3 className="w-5 h-5 text-purple-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats?.readBooks || 0}</p>
            <p className="text-sm text-gray-500">Read</p>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <BookOpen className="w-5 h-5 text-orange-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats?.readingBooks || 0}</p>
            <p className="text-sm text-gray-500">Reading</p>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <Users className="w-5 h-5 text-pink-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats?.familyMembers || 0}</p>
            <p className="text-sm text-gray-500">Family</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Link href="/books/add" className="flex items-center p-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition">
                <Plus className="w-5 h-5 mr-3" />
                Add New Book
              </Link>
              <Link href="/books" className="flex items-center p-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition">
                <BookOpen className="w-5 h-5 mr-3" />
                Browse Library
              </Link>
              <Link href="/shelves" className="flex items-center p-3 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition">
                <List className="w-5 h-5 mr-3" />
                My Shelves
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
            <div className="space-y-3">
              {stats?.recentActivity && stats.recentActivity.length > 0 ? (
                stats.recentActivity.slice(0, 5).map((activity: any, idx: number) => (
                  <div key={idx} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ backgroundColor: activity.avatar_color }}>
                      {activity.display_name[0].toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{activity.display_name}</p>
                      <p className="text-xs text-gray-500 truncate">
                        {activity.status === 'read' ? 'finished' : activity.status === 'reading' ? 'is reading' : 'added'} "{activity.title}"
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">No recent activity</p>
              )}
            </div>
          </div>
        </div>

        {/* Family Members */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Family Members</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <FamilyMembersList />
          </div>
        </div>
      </main>
    </div>
  );
}

function FamilyMembersList() {
  const [members, setMembers] = useState<any[]>([]);

  useEffect(() => {
    async function fetchMembers() {
      try {
        const res = await fetch('/api/family');
        if (res.ok) {
          const data = await res.json();
          setMembers(data);
        }
      } catch (error) {
        console.error('Failed to fetch members:', error);
      }
    }
    fetchMembers();
  }, []);

  return (
    <>
      {members.map((member) => (
        <div key={member.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
          <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold" style={{ backgroundColor: member.avatarColor }}>
            {member.displayName[0].toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{member.displayName}</p>
            <p className="text-xs text-gray-500">@{member.username}</p>
          </div>
        </div>
      ))}
    </>
  );
}
