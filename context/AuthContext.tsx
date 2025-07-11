import * as SecureStore from 'expo-secure-store';
import { createContext, useContext, useEffect, useState } from 'react';

type User = {
    id: string;
    name: string;
    email: string;
    role: string;
};

type AuthContextType = {
    token: string | null;
    user: User | null;
    isAdmin: boolean;
    isAuthenticated: boolean;
    login: (token: string, user: User) => Promise<void>;
    logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
    token: null,
    user: null,
    isAdmin: false,
    isAuthenticated: false,
    login: async () => { },
    logout: async () => { },
});


export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null);

    const isAuthenticated = !!token;
    const isAdmin = user?.role === 'admin';

    useEffect(() => {
        const loadFromStorage = async () => {
            const storedToken = await SecureStore.getItemAsync('token');
            const storedUser = await SecureStore.getItemAsync('user');

            if (storedToken && storedUser) {
                setToken(storedToken);
                setUser(JSON.parse(storedUser));
            }
        };

        loadFromStorage();
    }, []);

    const login = async (token: string, user: User) => {
        await SecureStore.setItemAsync('token', token);
        await SecureStore.setItemAsync('user', JSON.stringify(user));

        setToken(token);
        setUser(user);
    };

    const logout = async () => {
        await SecureStore.deleteItemAsync('token');
        await SecureStore.deleteItemAsync('user');

        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ token, user, isAdmin, isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
}
