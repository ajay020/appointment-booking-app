import { clearTokens, getAccessToken, getRefreshToken, saveTokens } from '@/lib/token';
import { AuthService } from '@/services/AuthService';
import { Logger } from '@/utils/logger';
import { useRouter } from 'expo-router';
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
    isLoadingAuth: boolean;
    isAuthenticated: boolean;
    login: (accessToken: string, refreshToken: string, user: User) => Promise<void>;
    logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
    accessToken: null,
    refreshToken: null,
    user: null,
    isAdmin: false,
    isLoadingAuth: true,
    isAuthenticated: false,
    login: async () => { },
    logout: async () => { },
});


export function AuthProvider({ children }: { children: React.ReactNode }) {
    Logger.log('Initializing AuthProvider');
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [refreshToken, setRefreshToken] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [isLoadingAuth, setIsLoadingAuth] = useState(true);

    const router = useRouter();


    const isAuthenticated = !!accessToken && !!user;
    const isAdmin = user?.role === 'admin';

    useEffect(() => {
        const loadFromStorage = async () => {
            try {
                const token = await getAccessToken();
                const refresh = await getRefreshToken();
                const userDataString = await SecureStore.getItemAsync('user');

                Logger.log('Loading auth data from storage:')

                if (token && refresh && userDataString) {
                    setAccessToken(token);
                    setRefreshToken(refresh);
                    setUser(JSON.parse(userDataString));
                }
            } catch (error) {
                console.error("Error loading auth data from storage:", error);
                // Handle potential parsing errors or corrupted data
                await clearTokens(); // Clear potentially bad tokens
                await SecureStore.deleteItemAsync('user');
            } finally {
                setIsLoadingAuth(false); // Set to false once loading is complete
            }
        };

        loadFromStorage();
    }, []);

    const login = async (accessToken: string, refreshToken: string, user: User) => {
        Logger.log('Logging in with accessToken:', accessToken);
        await saveTokens(accessToken, refreshToken);
        await SecureStore.setItemAsync('user', JSON.stringify(user));

        setAccessToken(accessToken);
        setRefreshToken(refreshToken);
        setUser(user);

        // After login, ensure isLoadingAuth is false
        setIsLoadingAuth(false);
    };

    const logout = async () => {
        await clearTokens();
        await SecureStore.deleteItemAsync('user');

        setAccessToken(null);
        setRefreshToken(null);
        setUser(null);

        // After logout, ensure isLoadingAuth is false
        setIsLoadingAuth(false); // Important for navigating back to auth screens

        Logger.log('User logged out successfully');
        router.replace('/login');
    };

    useEffect(() => {
        // Set logout function in AuthService
        AuthService.setLogout(logout)
    }, [])

    return (
        <AuthContext.Provider value={{
            accessToken,
            refreshToken,
            user,
            isAdmin,
            isAuthenticated,
            isLoadingAuth,
            login,
            logout
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
}
