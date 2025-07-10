import { AuthProvider } from '@/context/AuthContext';
import { Stack } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Layout() {
    return (
        <AuthProvider>
            <SafeAreaView style={{ flex: 1 }}>
                <View style={styles.container}>
                    <Stack  >
                        <Stack.Screen name="login" options={{ title: 'Login', headerShown: false }} />
                        <Stack.Screen name="register" options={{ title: 'Register', headerShown: false }} />
                    </Stack>
                </View>
            </SafeAreaView>
        </AuthProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
});


