import { useEffect, useState } from "react";
import { getSession } from "@/lib/auth";
import { User } from "@/types/auth";
import axios from "axios"; 

export function useAuth() {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const session = await getSession();
                setIsAuthenticated(session.isAuthenticated);
                setUser(session.user);
                setError(null);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Auth check failed");
                setIsAuthenticated(false);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    const logout = async () => {
        try {
            await axios.post('/api/auth/logout'); // Call the logout API endpoint
            setIsAuthenticated(false);
            setUser(null);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Logout failed");
        }
    };

    return { isAuthenticated, user, loading, error, logout }; // Include logout in the return
}

export default useAuth;