import { User, Session } from '@/types/auth';

const BACKEND_URL = typeof window !== 'undefined' && window.location.hostname !== 'localhost'
  ? 'https://github-actions-deploy-7ddg43rwta-uc.a.run.app'
  : 'http://localhost:4000';

/**
 * Get current user session from backend
 */
export async function getSession(): Promise<Session> {
  try {
    // Get token from localStorage
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    
    if (!token) {
      return { user: null, isAuthenticated: false };
    }

    // Verify token with backend
    const response = await fetch(`${BACKEND_URL}/api/token/verify`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
    });

    if (!response.ok) {
      // Token invalid/expired, remove it
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
      }
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
    // Remove token from localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }

    const response = await fetch(`${BACKEND_URL}/api/auth/logout`, {
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
