export interface User {
  id: string;
  githubId: string;
  username: string;
  email: string | null;
  avatarUrl: string | null;
}

export interface Session {
  user: User | null;
  isAuthenticated: boolean;
}