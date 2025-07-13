import { useAuth } from '@/context/AuthContext';
import api from '@/lib/apiClient';
import { Logger } from '@/utils/logger';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
import Toast from 'react-native-toast-message';

export default function LoginScreen() {
    const { login } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const router = useRouter();


    const handleLogin = async () => {
        if (!email || !password) {
            Toast.show({ type: 'Error', text1: 'Please enter email and password' });
            return
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
            router.replace("/")
        } catch (err: any) {
            Logger.error('Login error:', err);
            Toast.show({
                type: 'error',
                text1: 'Login Failed',
                text2: err.response?.data?.msg || 'Something went wrong',
            });
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
