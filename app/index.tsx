import { useAuth } from "@/context/AuthContext";
import { Stack, useRouter } from "expo-router";
import { useEffect } from "react";
import { Button, Text, View } from "react-native";

function Home() {
    const { isAuthenticated, logout } = useAuth();
    const router = useRouter();

    useEffect(() => {

        if (!isAuthenticated) {
            router.replace("/login");
        }
    }, [isAuthenticated]);

    if (!isAuthenticated) return null;

    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Stack.Screen options={{ title: 'Home' }} />
            <Text style={{ fontSize: 24 }}>Welcome to the Appointment Booking App!</Text>
            <Button
                title="Logout"
                onPress={async () => {
                    logout();
                    router.replace("/login");
                }}
            />
        </View>
    );
}

export default Home;    