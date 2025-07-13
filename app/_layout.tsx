
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { Logger } from '@/utils/logger';
import { SplashScreen, Stack } from 'expo-router';
import { useEffect } from 'react';
import { SafeAreaView } from 'react-native';
import Toast from 'react-native-toast-message';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

function RootLayoutContent() {
    const { isAuthenticated, isLoadingAuth } = useAuth();

    Logger.log('Rootlayout content render', isAuthenticated, isLoadingAuth);

    useEffect(() => {
        if (!isLoadingAuth) {
            SplashScreen.hideAsync();
        }
    }, [isLoadingAuth, isAuthenticated]);

    // If we are still loading authentication status, don't render anything yet
    // or render a simple loading indicator
    if (isLoadingAuth) {
        return null; // Or <LoadingScreen /> if you have one
    }

    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />

        </Stack>
    );
}


export default function RootLayout() {
    return (
        <AuthProvider>
            <SafeAreaView style={{ flex: 1 }}>
                <RootLayoutContent />
            </SafeAreaView>
            <Toast visibilityTime={2000} />
        </AuthProvider>
    );
}




