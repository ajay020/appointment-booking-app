import { clearTokens, getAccessToken, getRefreshToken, saveTokens } from '@/lib/token';
import { AuthService } from '@/services/AuthService';
import * as SecureStore from 'expo-secure-store';
import { createContext, useContext, useEffect, useState } from 'react';

type User = {
    id: string;
    name: string;
    email: string;
    role: string;
};

type AuthContextType = {
    accessToken: string | null;
    refreshToken: string | null;
    user: User | null;
    isAdmin: boolean;
    isAuthenticated: boolean;
    login: (accessToken: string, refreshToken: string, user: User) => Promise<void>;
    logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
    accessToken: null,
    refreshToken: null,
    user: null,
    isAdmin: false,
    isAuthenticated: false,
    login: async () => { },
    logout: async () => { },
});


export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [refreshToken, setRefreshToken] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null);

    const isAuthenticated = !!accessToken && !!user;
    const isAdmin = user?.role === 'admin';

    useEffect(() => {
        const loadFromStorage = async () => {
            const token = await getAccessToken();
            const refresh = await getRefreshToken();
            const userData = await SecureStore.getItemAsync('user');

            if (token && refresh && userData) {
                setAccessToken(token);
                setRefreshToken(refresh);
                setUser(JSON.parse(userData));
            }
        };

        loadFromStorage();
    }, []);

    const login = async (accessToken: string, refreshToken: string, user: User) => {
        await saveTokens(accessToken, refreshToken);
        await SecureStore.setItemAsync('user', JSON.stringify(user));

        setAccessToken(accessToken);
        setRefreshToken(refreshToken);
        setUser(user);
    };

    const logout = async () => {
        await clearTokens();
        await SecureStore.deleteItemAsync('user');

        setAccessToken(null);
        setRefreshToken(null);
        setUser(null);
    };

    useEffect(() => {
        // Set logout function in AuthService
        AuthService.setLogout(logout)
    })

    return (
        <AuthContext.Provider value={{ accessToken, refreshToken, user, isAdmin, isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
}
