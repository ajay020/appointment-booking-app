import api from '@/lib/apiClient';
import { Logger } from '@/utils/logger';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Button, Platform, StyleSheet, Text, View } from 'react-native';
import Toast from 'react-native-toast-message';

export default function CreateSlotScreen() {
    const [date, setDate] = useState<Date | null>(null);
    const [time, setTime] = useState<Date | null>(null);
    const [loading, setLoading] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);

    const router = useRouter();

    const handleCreateSlot = async () => {
        if (!date || !time) {
            Toast.show({
                type: 'error',
                text1: 'Validation Error',
                text2: 'Date and Time are required',
            });
            return;
        }

        const dateStr = date?.toISOString().split('T')[0]; // YYYY-MM-DD
        const timeStr = time?.toTimeString().split(':').slice(0, 2).join(':'); // HH:MM
        Logger.log('Creating slot with date:', dateStr, 'and time:', timeStr);

        try {
            setLoading(true);
            const res = await api.post('/slots', { date: dateStr, time: timeStr });
            Logger.log('Slot created:', res.data);

            Toast.show({
                type: 'success',
                text1: 'Slot created successfully',
            });
            router.replace('/slots');
        } catch (err: any) {
            Logger.error(err);
            Toast.show({
                type: 'error',
                text1: 'Error creating slot',
                text2: err.response?.data?.msg || 'Something went wrong',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Create a New Slot</Text>

            {/* Date Picker */}
            <Button
                title={date ? `📅 ${date.toDateString()}` : 'Select Date'}
                onPress={() => setShowDatePicker(true)}
            />
            {showDatePicker && (
                <DateTimePicker
                    value={date || new Date()}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    minimumDate={new Date()}
                    onChange={(_, selectedDate) => {
                        setShowDatePicker(false);
                        Logger.log('Selected date:', selectedDate);
                        if (selectedDate) setDate(selectedDate);
                    }}
                />
            )}

            {/* Time Picker */}
            <Button
                title={time ? `⏰ ${time.toTimeString().slice(0, 5)}` : 'Select Time'}
                onPress={() => setShowTimePicker(true)}
            />
            {showTimePicker && (
                <DateTimePicker
                    value={time || new Date()}
                    mode="time"
                    is24Hour={true}
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={(_, selectedTime) => {
                        setShowTimePicker(false);
                        if (selectedTime) setTime(selectedTime);
                    }}
                />
            )}

            <View style={{ marginTop: 16 }}>
                <Button
                    title={loading ? 'Creating...' : 'Create Slot'}
                    onPress={handleCreateSlot} disabled={loading}
                />
            </View>
        </View>
    );
}


const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, gap: 16 },
    title: { fontSize: 20, fontWeight: 'bold', marginBottom: 8 },
});
