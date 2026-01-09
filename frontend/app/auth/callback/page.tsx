'use client';

import { Suspense } from 'react';
import CallbackHandler from './callback-handler';

export default function CallbackPage() {
  return (
    <Suspense fallback={<AuthLoading message="Authenticating..." />}>
      <CallbackHandler />
    </Suspense>
  );
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
