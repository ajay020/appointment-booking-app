import { updateUserProfile } from '@/api/userApi';
import { Logger } from '@/utils/logger';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity
} from 'react-native';
import Toast from 'react-native-toast-message';

interface UserData {
    id: string;
    name: string;
    email: string;
}

export default function EditProfileScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const initialUser: UserData = params.user ? JSON.parse(params.user as string) : {};

    const [name, setName] = useState(initialUser.name || '');
    const [email, setEmail] = useState(initialUser.email || '');
    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        if (!name || !email) {
            Toast.show({
                type: 'error',
                text1: 'Validation Error',
                text2: 'Please fill in all required fields.',
            });

            return;
        }

        setLoading(true);
        try {
            const updatedData = { name, email };
            await updateUserProfile(updatedData);
            Toast.show({
                type: 'success',
                text1: 'Profile Updated',
                text2: 'Your profile has been updated successfully.',
            });
            router.back(); // Go back to the previous screen (UserProfileScreen)
        } catch (error: any) {
            Logger.error('Failed to update profile:', error.response?.data || error.message);
            Toast.show({
                type: 'error',
                text1: 'Update Failed',
                text2: error.response?.data?.message || 'An error occurred while updating your profile.',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <Stack.Screen options={{ headerShown: true, title: 'Edit Profile' }} />
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.label}>Name</Text>
                <TextInput
                    style={styles.input}
                    value={name}
                    onChangeText={setName}
                    placeholder="Your Name"
                />

                <Text style={styles.label}>Email</Text>
                <TextInput
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                    placeholder="Your Email"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    editable={false}
                />


                <TouchableOpacity
                    style={styles.saveButton}
                    onPress={handleSave}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.saveButtonText}>Save Changes</Text>
                    )}
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => router.back()}
                    disabled={loading}
                >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        backgroundColor: '#f9f9f9',
        justifyContent: 'center', // Center content vertically
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#555',
        marginBottom: 8,
        marginTop: 15,
    },
    input: {
        width: '100%',
        backgroundColor: '#fff',
        borderRadius: 8,
        paddingHorizontal: 15,
        paddingVertical: 12,
        fontSize: 16,
        borderColor: '#ddd',
        borderWidth: 1,
        marginBottom: 10,
    },
    saveButton: {
        backgroundColor: '#007bff',
        paddingVertical: 15,
        borderRadius: 10,
        marginTop: 30,
        alignItems: 'center',
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    cancelButton: {
        marginTop: 15,
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: 'center',
        backgroundColor: '#e0e0e0',
    },
    cancelButtonText: {
        color: '#333',
        fontSize: 18,
        fontWeight: 'bold',
    },
});