import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { fetchCommits, fetchLanguages, fetchScores,  } from "@/lib/api";
import { CommitSummary, LanguageBreakdown, Score } from "@/types/github";

export function useCommits() {
    const { user } = useAuth();
    const [commits, setCommits] = useState<CommitSummary | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadCommits = async () => {
            try {
                if (user) {
                    const data = await fetchCommits(user.username);
                    setCommits(data);
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch commits');
            } finally {
                setLoading(false);
            }
        }
        loadCommits();
    }, [user]);
    return { commits, loading, error };
}

export function useLanguages() {
    const { user } = useAuth();
    const [languages, setLanguages] = useState<LanguageBreakdown | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadLanguages = async () => {
            try {
                if (user) {
                    const data = await fetchLanguages(user.username);
                    setLanguages(data);
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch languages');
            } finally {
                setLoading(false);
            }
        }
        loadLanguages();
    }, [user]);
    return { languages, loading, error };
}

export function useScores() {
    const { user } = useAuth();
    const [scores, setScores] = useState<Score | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadScores = async () => {
            try {
                if (user) {
                    const data = await fetchScores(user.username);
                    setScores(data);
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch scores');
            } finally {
                setLoading(false);
            }
        }
        loadScores();
    }, [user]);
    return { scores, loading, error };
}


export default useCommits;