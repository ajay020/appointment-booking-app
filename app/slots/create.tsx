import api from '@/lib/apiClient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Button, StyleSheet, Text, TextInput, View } from 'react-native';

export default function CreateSlotScreen() {
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    const handleCreateSlot = async () => {
        if (!date || !time) {
            return Alert.alert('Validation Error', 'Date and Time are required');
        }

        try {
            setLoading(true);
            const res = await api.post('/slots', { date, time },);
            console.log("response data", res.data);

            Alert.alert('Success', 'Slot created successfully!');
            router.replace('/slots'); // Navigate back to slots list
        } catch (err: any) {
            console.error(err);
            Alert.alert('Error', err.response?.data?.msg || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Create a New Slot</Text>

            <TextInput
                style={styles.input}
                placeholder="Date (YYYY-MM-DD)"
                value={date}
                onChangeText={setDate}
            />
            <TextInput
                style={styles.input}
                placeholder="Time (HH:MM 24hr format)"
                value={time}
                onChangeText={setTime}
            />

            <Button
                title={loading ? 'Creating...' : 'Create Slot'}
                onPress={handleCreateSlot}
                disabled={loading}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16 },
    title: { fontSize: 20, fontWeight: 'bold', marginBottom: 16 },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 12,
        marginBottom: 12,
        borderRadius: 6,
    },
});
