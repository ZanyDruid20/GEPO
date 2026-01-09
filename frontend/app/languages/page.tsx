'use client';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Header from '@/components/ui/Header';
import Stats from '@/components/dashboard/Stats';
import LanguageChart from '@/components/dashboard/LanguageChart';

export default function Languages() {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900">Languages</h1>
          <p className="text-slate-600 mt-2">Programming language breakdown</p>
        </div>

        {/* Stats */}
        <div className="mb-8">
          <Stats />
        </div>

        {/* Language Chart */}
        <LanguageChart />
      </div>
    </div>
  );
}
