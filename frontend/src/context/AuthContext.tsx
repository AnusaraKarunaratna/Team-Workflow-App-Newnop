import { createContext, useEffect, useState } from "react";
import { getMe } from "../services/auth.service";

export const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: any) => {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const loadUser = async () => {
        const token = localStorage.getItem("token");
        
        // If there's no token, stop loading and keep user null
        if (!token) {
            setUser(null);
            setLoading(false);
            return;
        }

        try {
            const res = await getMe();
            setUser(res.data);
        } catch {
            // If the token is invalid or the /me route fails, clear the bad token
            localStorage.removeItem("token");
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    // Run once when the app starts
    useEffect(() => {
        loadUser();
    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser, loading, loadUser }}>
            {children}
        </AuthContext.Provider>
    );
};