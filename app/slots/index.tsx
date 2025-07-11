import { useAuth } from '@/context/AuthContext';
import api from '@/lib/apiClient';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Button,
    FlatList,
    StyleSheet,
    Text,
    View
} from 'react-native';
import { Calendar } from 'react-native-calendars';

type Slot = {
    _id: string;
    date: string;
    time: string;
    status: string;
    isBooked: boolean;
};

export default function SlotsScreen() {
    const { token } = useAuth();
    const [selectedDate, setSelectedDate] = useState<string>(getTodayDate());
    const [slots, setSlots] = useState<Slot[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Format today's date as YYYY-MM-DD
    function getTodayDate() {
        return new Date().toISOString().split('T')[0];
    }

    function getMinDate() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const minDate = today.toLocaleDateString('en-CA');
        return minDate; // YYYY-MM-DD format
    }

    const fetchSlots = async (date: string) => {
        setLoading(true);
        setError(null);

        try {
            const res = await api.get(`/slots?date=${date}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setSlots(res.data.slots); // Adjust based on your API response
        } catch (err: any) {
            console.error(err);
            setError('Failed to load slots');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSlots(selectedDate);
    }, [selectedDate]);

    const bookSlot = async (slotId: string) => {
        setLoading(true);
        try {
            const res = await api.post(
                `/bookings/${slotId}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            Alert.alert('Success', 'Slot booked successfully!');
            fetchSlots(selectedDate); // refresh
        } catch (err: any) {
            console.error(err);
            Alert.alert('Booking Failed', err.response?.data?.msg || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    const renderItem = ({ item }: { item: Slot }) => (
        <View style={styles.slot}>
            <Text style={styles.slotText}>
                {item.time} — {item.status.toUpperCase()}
            </Text>
            {item.isBooked ? (
                <Text style={styles.booked}>Booked</Text>
            ) : (
                <Button title="Book" onPress={() => bookSlot(item._id)} />
            )}
        </View>
    );

    return (
        <View style={styles.container}>
            <Calendar
                minDate={getMinDate()}
                markedDates={{
                    [selectedDate]: { selected: true, selectedColor: '#00adf5' },
                }}
                onDayPress={(day) => setSelectedDate(day.dateString)}
            />

            {error && <Text style={styles.error}>{error}</Text>}

            {slots.length === 0 && !loading && (
                <Text style={styles.error}>No slots available for this date.</Text>
            )}

            {
                loading
                    ? (<ActivityIndicator size="large" color="#000" />)
                    : (<FlatList
                        data={slots}
                        keyExtractor={(item) => item._id}
                        renderItem={renderItem}
                        contentContainerStyle={{ paddingVertical: 16 }}
                    />)
            }

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    slot: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    slotText: {
        fontSize: 16,
    },
    booked: {
        color: 'gray',
        fontWeight: 'bold',
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'center',
    },
    error: {
        color: 'red',
        textAlign: 'center',
        marginBottom: 8,
    },
});
