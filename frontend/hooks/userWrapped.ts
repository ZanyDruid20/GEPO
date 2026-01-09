import { useState, useEffect } from 'react';
import { fetchWrapped } from '@/lib/api';
import useAuth from '@/hooks/useAuth';
import { WrappedReport } from '@/types/github';

export function useWrapped() {
    const { user } = useAuth();
    const [wrapped, setWrapped] = useState<WrappedReport | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    useEffect(() => {
        const loadWrapped = async () => {
            try {
                if (user) {
                    const data = await fetchWrapped(user.username);
                    setWrapped(data);
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch wrapped report');
            } finally {
                setLoading(false);
            }
        }
        loadWrapped();
    }
    , [user]);
    return { wrapped, loading, error };
}
export default useWrapped;