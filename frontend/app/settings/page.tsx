'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/button';

export default function Settings() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logout();
      router.push('/auth/login');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Logout failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!deleteConfirm) {
      setDeleteConfirm(true);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      // Get token from localStorage
      const token = localStorage.getItem('auth_token');
      
      const res = await fetch('/api/auth/delete-account', {
        method: 'DELETE',
        headers: {
          'x-auth-token': token || '',
        },
      });

      if (!res.ok) throw new Error('Failed to delete account');

      // Clear token
      localStorage.removeItem('auth_token');
      await logout();
      router.push('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete account');
    } finally {
      setLoading(false);
      setDeleteConfirm(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div>
          <h1 className="text-4xl font-bold text-slate-900">Settings</h1>
          <p className="text-slate-600 mt-2">Manage your account</p>
        </div>

        {/* Account Info */}
        <Card className="bg-white/80 backdrop-blur shadow-lg border-0">
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-slate-600">Username</span>
              <span className="font-medium text-slate-900">{user?.username || 'N/A'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-600">Email</span>
              <span className="font-medium text-slate-900">{user?.email || 'N/A'}</span>
            </div>
          </CardContent>
        </Card>

        {/* Logout */}
        <Card className="bg-white/80 backdrop-blur shadow-lg border-0">
          <CardHeader>
            <CardTitle>Session</CardTitle>
          </CardHeader>
          <CardContent>
            {error && <p className="text-red-600 mb-4 text-sm">{error}</p>}
            <Button
              onClick={handleLogout}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              {loading ? 'Logging out...' : 'Logout'}
            </Button>
          </CardContent>
        </Card>

        {/* Delete Account */}
        <Card className="bg-white/80 backdrop-blur shadow-lg border-0 border-l-4 border-red-600">
          <CardHeader>
            <CardTitle className="text-red-600">Danger Zone</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-slate-600">
              Permanently delete your account and all data. This cannot be undone.
            </p>
            {error && <p className="text-red-600 text-sm">{error}</p>}
            
            <Button
              onClick={handleDeleteAccount}
              disabled={loading}
              className={`w-full ${
                deleteConfirm
                  ? 'bg-red-600 hover:bg-red-700'
                  : 'bg-slate-300 hover:bg-slate-400'
              } text-white`}
            >
              {loading ? 'Deleting...' : deleteConfirm ? 'Confirm Delete Account' : 'Delete Account'}
            </Button>

            {deleteConfirm && (
              <Button
                onClick={() => setDeleteConfirm(false)}
                disabled={loading}
                className="w-full bg-slate-600 hover:bg-slate-700 text-white"
              >
                Cancel
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}