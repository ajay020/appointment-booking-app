import { useAuth } from "@/context/AuthContext";
import { Stack, useRouter } from "expo-router";
import { Button, StyleSheet, Text, View } from "react-native";

function Home() {
    const { logout, user } = useAuth();
    const router = useRouter();

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ title: 'Home' }} />

            <View>
                <Text style={{ fontSize: 24 }}>Hi, {user?.name}</Text>
                <Text style={{ fontSize: 24 }}>Welcome to the Appointment Booking App!</Text>
            </View>

            <View style={styles.btnContainer}>
                <Button
                    title="📅 Book Appointment"
                    onPress={() => router.push('/slots')}
                />
                <Button
                    title="📖 My Bookings"
                    onPress={() => router.push('/bookings')}
                />
                {user?.role === 'admin' && (
                    <Button
                        title="🛠️ Admin Dashboard"
                        onPress={() => router.push('/admin/dashboard')}
                    />
                )}
                <Button
                    title="Logout"
                    onPress={async () => {
                        logout();
                        // router.replace("/login");
                    }}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        justifyContent: "space-between",
        alignItems: "center",
        flex: 1,
        // backgroundColor: "light-gray"
    },
    btnContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 20,
        marginTop: 50,
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
        fontWeight: 'bold'
    },
});

export default Home;    