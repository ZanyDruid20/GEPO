'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Header from '@/components/ui/Header';
import Stats from '@/components/dashboard/Stats';
import LanguageChart from '@/components/dashboard/LanguageChart';
import CommitTimeline from '@/components/dashboard/CommitTimeline';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';

export default function Dashboard() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-slate-900">Dashboard</h1>
            <p className="text-slate-600 mt-2">Coding journey so far</p>
          </div>
          <Link
            href="/settings"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            ⚙️ Settings
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="mb-8">
          <Stats />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <LanguageChart />
          <CommitTimeline />
        </div>

        {/* Wrapped CTA */}
        <Link
          href="/wrapped"
          className="block p-8 bg-linear-to-r from-purple-600 to-indigo-600 rounded-xl text-white text-center hover:shadow-2xl transition-shadow"
        >
          <div className="text-2xl font-bold mb-2">✨ Wrapped</div>
          <div className="text-purple-100">View your all-time coding stats</div>
        </Link>
      </div>
    </div>
  );
}
