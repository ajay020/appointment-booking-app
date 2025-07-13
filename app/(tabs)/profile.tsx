import { getUserProfile, User } from '@/api/userApi';
import { Logger } from '@/utils/logger';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Button,
    Image,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
interface Booking {
    _id: string;
    service: string;
    date: string;
    time: string;
}

export default function UserProfileScreen() {

    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [refreshing, setRefreshing] = useState<boolean>(false);
    const [bookings, setBookings] = useState<Booking[]>([]); // mock for now
    const [error, setError] = useState<string>('');

    const router = useRouter();


    const fetchProfile = async () => {
        try {
            setError('');
            const data: User = await getUserProfile();
            setUser(data);

            // 🧪 Mock bookings for now — replace with real API call later
            const mockBookings: Booking[] = [
                { _id: '1', service: 'Dental Checkup', date: '2025-07-14', time: '10:30 AM' },
                { _id: '2', service: 'Eye Exam', date: '2025-07-15', time: '02:00 PM' },
            ];
            setBookings(mockBookings);
        } catch (err) {
            console.error(err);
            setError('Failed to load profile.');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    // Use useFocusEffect to re-fetch data when the screen comes into focus
    useFocusEffect(
        useCallback(() => {
            Logger.log('Profile screen focused, fetching profile...');
            fetchProfile();

        }, []) // Empty dependency array means this effect runs only when the screen mounts and focuses
    );

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchProfile();
    }, []);

    const handleEditProfile = () => {
        // Navigate to the edit profile screen, passing current user data as params
        // This is good for pre-filling the form.
        router.push({
            pathname: '/edit-profile', // This will be your new screen path
            params: { user: JSON.stringify(user) }, // Pass user object as string
        });
    };

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#000" />
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.center}>
                <Text style={styles.error}>{error}</Text>
            </View>
        );
    }

    return (
        <ScrollView
            contentContainerStyle={styles.container}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
            {/* 👤 Profile Info Row */}
            <View style={styles.profileRow}>
                <Image
                    source={require('../../assets/images/react-logo.png')}
                    style={styles.avatar}
                />
                <View style={styles.userInfo}>
                    <Text style={styles.name}>{user?.name}</Text>
                    <Text style={styles.email}>{user?.email}</Text>
                </View>
            </View>

            {/* ✏️ Edit Profile Button */}
            <View style={styles.editButtonContainer}>
                <Button title="Update Profile" onPress={handleEditProfile} />
            </View>

            {/* 📅 Booking List */}
            <Text style={styles.sectionTitle}>Your Bookings</Text>
            {bookings.length === 0 ? (
                <Text style={styles.noBookings}>You have no bookings yet.</Text>
            ) : (
                bookings.map((booking) => (
                    <View key={booking._id} style={styles.bookingCard}>
                        <Text style={styles.bookingText}>{booking.service}</Text>
                        <Text style={styles.bookingSubText}>{booking.date} at {booking.time}</Text>
                    </View>
                ))
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        paddingBottom: 40,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    profileRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 25,
    },
    avatar: {
        width: 70,
        height: 70,
        borderRadius: 35,
        marginRight: 15,
    },
    userInfo: {
        flex: 1,
    },
    name: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    email: {
        fontSize: 16,
        color: '#666',
        marginTop: 4,
    },
    editButtonContainer: {
        marginBottom: 30,
        alignSelf: 'flex-start',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 10,
    },
    bookingCard: {
        padding: 12,
        backgroundColor: '#f0f0f0',
        borderRadius: 10,
        marginBottom: 10,
    },
    bookingText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    bookingSubText: {
        fontSize: 14,
        color: '#555',
        marginTop: 4,
    },
    noBookings: {
        fontSize: 16,
        color: '#999',
        fontStyle: 'italic',
    },
    error: {
        fontSize: 16,
        color: 'red',
    },
});
