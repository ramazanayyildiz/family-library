'use client';

import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { BookOpen, Users, BookMarked, Star, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) {
      router.push('/dashboard');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Navigation */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">Family Library</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/login" className="text-gray-600 hover:text-gray-900 font-medium">
              Sign In
            </Link>
            <Link
              href="/register"
              className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Your Family's Digital
            <span className="text-blue-600"> Library</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Track books, mark what you've read, and discover what your family is reading.
            Perfect for book-loving families!
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="w-full sm:w-auto px-8 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-semibold text-lg transition flex items-center justify-center"
            >
              Start Your Library
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
            <Link
              href="/login"
              className="w-full sm:w-auto px-8 py-4 bg-white text-gray-900 rounded-xl hover:bg-gray-50 font-semibold text-lg transition border border-gray-200"
            >
              I Already Have an Account
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <FeatureCard
            icon={<Users className="w-8 h-8 text-blue-600" />}
            title="Multi-User Support"
            description="Each family member gets their own account. Track your reading independently while seeing what others are reading."
          />
          <FeatureCard
            icon={<BookMarked className="w-8 h-8 text-green-600" />}
            title="Track Reading Progress"
            description="Mark books as Want to Read, Reading, or Read. Add ratings and reviews to remember your thoughts."
          />
          <FeatureCard
            icon={<Star className="w-8 h-8 text-yellow-600" />}
            title="Personal Shelves"
            description="Create custom collections for different genres, family members, or reading goals."
          />
          <FeatureCard
            icon={<BookOpen className="w-8 h-8 text-purple-600" />}
            title="ISBN Lookup"
            description="Scan or enter ISBN to automatically fetch book details. No manual entry needed!"
          />
          <FeatureCard
            icon={<Users className="w-8 h-8 text-pink-600" />}
            title="Family Activity"
            description="See what your family members are reading. Great for book recommendations!"
          />
          <FeatureCard
            icon={<BookOpen className="w-8 h-8 text-indigo-600" />}
            title="Tags & Organization"
            description="Organize books with tags. Find books by genre, topic, or any category you want."
          />
        </div>

        {/* How It Works */}
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Step
              number="1"
              title="Create Account"
              description="Sign up and create profiles for all family members"
            />
            <Step
              number="2"
              title="Add Your Books"
              description="Use ISBN lookup or add books manually to build your library"
            />
            <Step
              number="3"
              title="Start Tracking"
              description="Mark books as read, rate them, and see family activity"
            />
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Organize Your Family Library?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join your family today and start tracking your reading journey together!
          </p>
          <Link
            href="/register"
            className="inline-flex items-center px-8 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-semibold text-lg transition"
          >
            Get Started for Free
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="font-semibold text-gray-900">Family Library</span>
            </div>
            <p className="text-gray-500 text-sm">
              Built with ❤️ for families who love reading together
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

function Step({ number, title, description }: { number: string; title: string; description: string }) {
  return (
    <div className="text-center">
      <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
        {number}
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}
