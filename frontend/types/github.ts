// types/github.ts
export interface Language {
  language: string;
  bytes: number;
  percentage: number;
}

export interface LanguageBreakdown {
  username: string;
  totalRepos: number;
  totalBytes: number;
  languages: Language[];
}

export interface CommitSummary {
  username: string;
  totalCommits: number;
  repoCount: number;
}

export interface Score {
  username: string;
  totalRepos: number;
  score: number;
}

export interface Repository {
  name: string;
  url: string;
  commits: number;
  language?: string;
  stars: number;
}

export interface WrappedReport {
  username: string;
  totalRepos: number;
  totalBytes: number;
  languages: Language[];
  totalCommits: number;
  score: number;
}