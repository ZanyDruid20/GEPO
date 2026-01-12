'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function CallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Check for JWT token in URL (new token-based flow)
        const token = searchParams.get('token');
        
        if (token) {
          // Store token in localStorage
          localStorage.setItem('auth_token', token);
          setLoading(false);
          router.push('/dashboard');
          return;
        }

        // Fallback to old OAuth code flow (shouldn't reach here with new backend)
        const code = searchParams.get('code');
        const state = searchParams.get('state');

        if (!code) {
          setError('No authorization code or token received');
          setLoading(false);
          return;
        }

        const backendUrl = 'https://github-actions-deploy-7ddg43rwta-uc.a.run.app';
        const response = await fetch(`${backendUrl}/api/auth/github/callback`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ code, state })
        });

        if (!response.ok) {
          throw new Error('Authentication failed');
        }

        const data = await response.json();
        
        if (data.user) {
          router.push('/dashboard');
        } else {
          setError('Authentication failed');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Authentication error');
        setLoading(false);
      }
    };

    handleCallback();
  }, [router, searchParams]);

  if (error) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <div style={{ textAlign: 'center' }}>
          <h1>Authentication Error</h1>
          <p>{error}</p>
          <a href="/auth/login">Back to Login</a>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <div style={{ textAlign: 'center' }}>
          <h1>Authenticating...</h1>
          <p>Please wait while we complete your sign-in.</p>
        </div>
      </div>
    );
  }

  return null;
}
