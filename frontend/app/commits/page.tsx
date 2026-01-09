/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import Header from '@/components/ui/Header';
import Stats from '@/components/dashboard/Stats';
import CommitTimeline from '@/components/dashboard/CommitTimeline';

export default function Commits() {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900">Commits</h1>
          <p className="text-slate-600 mt-2">Your commit activity overview</p>
        </div>

        {/* Stats */}
        <div className="mb-8">
          <Stats />
        </div>

        {/* Timeline */}
        <CommitTimeline />
      </div>
    </div>
  );
}
