import { useAuth } from '@/context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { Alert, TouchableOpacity } from 'react-native';

export default function TabLayout() {
    const { logout } = useAuth();

    const handleLogout = () => {
        Alert.alert(
            "Logout",
            "Are you sure you want to log out?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Logout",
                    onPress: async () => {
                        try {
                            await logout();
                            // AuthContext's logout should handle router.replace('/login')
                        } catch (e) {
                            Alert.alert("Logout Failed", "Could not log out. Please try again.");
                        }
                    },
                    style: "destructive"
                }
            ],
            { cancelable: true }
        );
    };

    return (
        <Tabs>
            <Tabs.Screen
                name="index" // Corresponds to app/(tabs)/index.jsx (your Home screen)
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="home" color={color} size={size} />
                    ),
                }}
            />
            <Tabs.Screen
                name="profile" // Corresponds to app/(tabs)/profile.jsx
                options={{
                    title: 'My Profile', // Header title for the profile tab
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="person" color={color} size={size} />
                    ),
                    headerRight: () => (
                        <TouchableOpacity onPress={handleLogout} style={{ marginRight: 15 }}>
                            <Ionicons name="log-out-outline" size={24} color="red" />
                        </TouchableOpacity>
                    ),
                    headerShown: true,
                }}
            />
            {/* You can add more Tabs.Screen components here for more tabs */}
        </Tabs>
    );
}