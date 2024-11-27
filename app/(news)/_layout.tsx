import { NewsContextProvider } from "@/contexts/news-provider";
import { Stack } from "expo-router";


export default function StackLayout() {
    return (
        <NewsContextProvider>
            <Stack>
                <Stack.Screen name="news" options={{ headerShown: false }} />
                <Stack.Screen name="news/[id]" options={{ headerShown: false }} />
            </Stack>
        </NewsContextProvider>
    )
}