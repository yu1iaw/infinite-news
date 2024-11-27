import { NewsContextProvider } from "@/contexts/news-provider";
import { Stack } from "expo-router";


export default function StackLayout() {
    return (
        <NewsContextProvider>
            <Stack>
                <Stack.Screen name="index" options={{ headerShown: false }} />
                <Stack.Screen name="[id]" options={{ headerShown: false }} />
            </Stack>
        </NewsContextProvider>
    )
}