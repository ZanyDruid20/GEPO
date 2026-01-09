'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function CallbackPage() {
  return (
    <Suspense fallback={<AuthLoading message="Authenticating..." />}> 
      <CallbackHandler />
    </Suspense>
  );
}

function CallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const code = searchParams.get('code');
        const state = searchParams.get('state');

        if (!code) {
          setError('No authorization code received from GitHub');
          setLoading(false);
          return;
        }

        const response = await fetch('http://localhost:4000/api/auth/github/callback', {
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
    return <AuthMessage title="Authentication Error" message={error} linkHref="/auth/login" linkText="Back to Login" />;
  }

  if (loading) {
    return <AuthLoading message="Please wait while we complete your sign-in." />;
  }

  return null;
}

function AuthLoading({ message }: { message: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <div style={{ textAlign: 'center' }}>
        <h1>Authenticating...</h1>
        <p>{message}</p>
      </div>
    </div>
  );
}

function AuthMessage({ title, message, linkHref, linkText }: { title: string; message: string; linkHref: string; linkText: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <div style={{ textAlign: 'center' }}>
        <h1>{title}</h1>
        <p>{message}</p>
        <a href={linkHref}>{linkText}</a>
      </div>
    </div>
  );
}
