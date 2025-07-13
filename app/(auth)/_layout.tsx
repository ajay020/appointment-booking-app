import { useAuth } from '@/context/AuthContext';
import { Redirect, Stack } from 'expo-router';

export default function AuthLayout() {

    const { isAuthenticated } = useAuth();

    // If user somehow lands on (auth) stack but is authenticated, redirect them
    // This helps prevent authenticated users from seeing login/register screens
    if (isAuthenticated) {
        return <Redirect href="/" />; // Redirect to home page
    }

    return (
        <Stack
            screenOptions={{
                headerShown: false,
                headerTitleAlign: 'center',
                headerTintColor: '#333'
            }}
        >
            <Stack.Screen name="login" options={{ headerShown: false }} />
            <Stack.Screen name="register" options={{ headerShown: false }} />
        </Stack>
    );
}