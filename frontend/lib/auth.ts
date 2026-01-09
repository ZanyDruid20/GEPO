import { User, Session } from '@/types/auth';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';

/**
 * Get current user session from backend
 */
export async function getSession(): Promise<Session> {
  try {
    const response = await fetch(`${BACKEND_URL}/api/auth/session`, {
      method: 'GET',
      credentials: 'include', // include cookies
    });

    if (!response.ok) {
      return { user: null, isAuthenticated: false };
    }

    const user: User = await response.json();
    return { user, isAuthenticated: true };
  } catch (error) {
    console.error('Failed to get session:', error);
    return { user: null, isAuthenticated: false };
  }
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  const session = await getSession();
  return session.isAuthenticated;
}

/**
 * Get current user
 */
export async function getCurrentUser(): Promise<User | null> {
  const session = await getSession();
  return session.user;
}

/**
 * Logout user
 */
export async function logout(): Promise<void> {
  try {
    const response = await fetch(`${BACKEND_URL}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Logout failed');
    }

    // Clear any client-side state if needed
    window.location.href = '/';
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
}

/**
 * Redirect to GitHub login
 */
export function loginWithGithub(): void {
  window.location.href = `${BACKEND_URL}/auth/github`;
}
