// This is the file for calling the graphql api from the backend 
// from commits, languages, etc.
import { CommitSummary, LanguageBreakdown, Score, WrappedReport} from "@/types/github";

// Define the shape of the GraphQL response
interface GraphQLResponse<T> {
    data: T | null;
    errors?: { message: string }[];
}

const GRAPHQL_URL = process.env.NEXT_PUBLIC_GRAPHQL_URL ?? "http://localhost:4000/graphql";

/**
 * function to send graphql queries to the backend
 */
async function fetchGraphQL<T>(query: string, variables: Record<string, unknown> = {}): Promise<T> {
    const response = await fetch(GRAPHQL_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include", // send cookies for session
        body: JSON.stringify({ query, variables }),
    });

    // parse the JSON response
    const result: GraphQLResponse<T> = await response.json();

    // Handle GraphQL errors
    if(result.errors) {
        throw new Error(result.errors.map(error => error.message).join(", "));
    }
    
    // Check if data is null
    if (result.data === null) {
        throw new Error("No data returned from GraphQL");
    }
    
    // handle the HTTP errors
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return result.data;
}

// function to fetch commits
export async function fetchCommits(username: string): Promise<CommitSummary> {
    const query = `
    query GetCommits($username: String!) {
        commits(username: $username) {
            username
            totalCommits
            repoCount
        }
    }`;
    const data = await fetchGraphQL<{ commits: CommitSummary }>(query, { username });
    return data.commits;
}

// function to fetch language breakdown
export async function fetchLanguages(username: string): Promise<LanguageBreakdown> {
    const query = `
    query GetLanguages($username: String!) {
      languages(username: $username) {
        username
        totalRepos
        totalBytes
        languages {
          language
          bytes
          percentage
        }
      }
    }`;
    const data = await fetchGraphQL<{ languages: LanguageBreakdown }>(query, { username });
    return data.languages;
}

// function to fetch score
export async function fetchScores(username: string): Promise<Score> {
    const query = `
    query GetScores($username: String!) {
      scores(username: $username) {
        username
        totalRepos
        score
      }
    }`;
    const data = await fetchGraphQL<{ scores: Score }>(query, { username });
    return data.scores;
}

// function to fetch wrapped report
export async function fetchWrapped(username: string): Promise<WrappedReport> {
    const query = `
    query GetWrapped($username: String!) {
      wrapped(username: $username) {
        username
        totalRepos
        totalBytes
        totalCommits
        score
        languages {
          language
          bytes
          percentage
        }
      }
    }`;
    const data = await fetchGraphQL<{ wrapped: WrappedReport }>(query, { username });
    return data.wrapped;
}

