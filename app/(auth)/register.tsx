import { useAuth } from '@/context/AuthContext';
import api from '@/lib/apiClient';
import { useRootNavigationState, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
import Toast from 'react-native-toast-message';

export default function RegisterScreen() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const { isAuthenticated, login } = useAuth();
    const router = useRouter();
    const navigationState = useRootNavigationState();

    // Redirect if already authenticated
    useEffect(() => {
        if (!navigationState?.key) return;
        if (isAuthenticated) {
            router.replace('/');
        }
    }, [navigationState, isAuthenticated]);

    const handleRegister = async () => {
        if (!name || !email || !password) {
            Toast.show({
                type: 'error',
                text1: 'Registration Error',
                text2: 'All fields are required',
            });
            return;
        }

        try {
            setLoading(true);

            const res = await api.post('/auth/register', {
                name,
                email,
                password,
            });
            const data = await res.data;
            console.log('Registration response:', data);

            await login(data.accessToken, data.refreshToken, data.user);
            router.replace('/');     // redirect to home
        } catch (err: any) {
            console.error('Registration error:', err);
            Toast.show({
                type: 'error',
                text1: 'Registration Failed',
                text2: err.response?.data?.msg || 'Something went wrong',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Register</Text>

            <TextInput
                style={styles.input}
                placeholder="Name"
                value={name}
                onChangeText={setName}
            />

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

            <Button title={loading ? 'Registering...' : 'Register'} onPress={handleRegister} disabled={loading} />

            <Text
                style={styles.link}
                onPress={() => router.push('/login')}
            >
                Already have an account? Login
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { padding: 20, marginTop: 100 },
    title: { fontSize: 24, marginBottom: 20, fontWeight: 'bold' },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginBottom: 15,
        borderRadius: 5,
    },
    link: { marginTop: 20, color: 'blue', textAlign: 'center' }
});
