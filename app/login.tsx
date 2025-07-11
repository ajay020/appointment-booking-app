import { useAuth } from '@/context/AuthContext';
import api from '@/lib/apiClient';
import { useRootNavigationState, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Button, StyleSheet, Text, TextInput, View } from 'react-native';

export default function LoginScreen() {
    const { isAuthenticated, login } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const router = useRouter();
    const navigationState = useRootNavigationState();


    // redirect to home if already logged in
    useEffect(() => {
        if (!navigationState?.key) return;

        if (isAuthenticated) {
            router.replace('/');
        }
    }, [navigationState, isAuthenticated]);

    const handleLogin = async () => {
        if (!email || !password) {
            return Alert.alert('Error', 'Please enter email and password');
        }

        try {
            setLoading(true);

            const res = await api.post('/auth/login', {
                email,
                password,
            });

            const data = await res.data;
            console.log('Login response:', data);

            await login(data.accessToken, data.refreshToken, data.user);
            router.replace('/'); // navigate to home
        } catch (err: any) {
            Alert.alert('Login Error', err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Login</Text>

            <TextInput
                style={styles.input}
                placeholder="Email"
                autoCapitalize="none"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
            />

            <TextInput
                style={styles.input}
                placeholder="Password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />

            <Button
                title={loading ? 'Logging in...' : 'Login'}
                onPress={handleLogin}
                disabled={loading}
            />

            <Text
                style={styles.link}
                onPress={() => router.push('/register')}
            >
                Don’t have an account? Register
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { padding: 20, marginTop: 100 },
    title: { fontSize: 24, marginBottom: 20, fontWeight: 'bold' },
    input: {
        borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 15, borderRadius: 5,
    },
    link: { marginTop: 20, color: 'blue', textAlign: 'center' }
});
