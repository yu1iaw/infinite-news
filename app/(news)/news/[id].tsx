import { ExternalLink } from "@/components/external-link";
import { categories, colors } from "@/constants";
import { useNewsContext } from "@/contexts/news-provider";
import { useGetSingleNews } from "@/lib/queries";
import tw from '@/lib/tailwind';
import { TNews } from "@/lib/types";
import { checkImageUrlFormat, manageStorage } from "@/lib/utils";
import { FontAwesome } from "@expo/vector-icons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Motion } from "@legendapp/motion";
import { ResizeMode, Video } from 'expo-av';
import { router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { Alert, Button, Easing, NativeScrollEvent, ScrollView, Text, TouchableOpacity, View } from "react-native";
import Spinner from 'react-native-loading-spinner-overlay';



export default function NewsDetails() {
    const [hasSaved, setHasSaved] = useState(false);
    const [isResizeMode, setIsResizeMode] = useState(false);
    const { id } = useLocalSearchParams<{ id: string }>();
    const { data: news, isLoading } = useGetSingleNews(id);


    useEffect(() => {
        if (!news) return;

        handleCheckExisting();
    }, [news])

    if (isLoading) {
        return (
            <Spinner
                visible={isLoading}
                textContent={'Loading...'}
                textStyle={tw`text-white text-lg font-bold`}
            />
        )
    }

    if (!news) {
        return (
            <View style={tw`flex-1 justify-center items-center gap-y-5 bg-[#ccc]`}>
                <Text style={tw`text-lg text-neutral-600`}>News isn't available. Try something else.</Text>
                <Button title="Go Back" onPress={router.back} />
            </View>
        )
    }


    const handleCheckExisting = async () => {
        try {
            const userUUID = await manageStorage.get('userUUID');
            const res = await fetch(`https://yu1ia-news4u.netlify.app/api/news/${id}?uuid=${userUUID}`);
            const { data } = await res.json();
            if (data.length) setHasSaved(true);
        } catch (error) {
            console.log(error);
        }
    }

    const handleScrollBegin = ({ nativeEvent }: { nativeEvent: NativeScrollEvent }) => {
        if (!nativeEvent.velocity) return;
        setIsResizeMode(!(nativeEvent.velocity.y > 0 && nativeEvent.contentOffset.y < 110));
    }


    return (
        <View style={tw`flex-1 bg-secondary`}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                onMomentumScrollBegin={handleScrollBegin}
                stickyHeaderIndices={[0]}
                stickyHeaderHiddenOnScroll={true}
            >
                <View>
                    <Motion.Image
                        animate={{ height: isResizeMode ? 100 : 320 }}
                        transition={{ type: "tween", duration: isResizeMode ? 300 : 800, easing: isResizeMode ? Easing.ease : Easing.elastic(1) }}
                        style={tw`w-full h-[320px] bg-primary`}
                        source={{ uri: news.image && checkImageUrlFormat(news.image) ? news.image : 'https://img.icons8.com/?size=800&id=122835&format=png&color=000000' }}
                    />
                    <NavBar
                        hasSaved={hasSaved}
                        setHasSaved={setHasSaved}
                        news={news}
                    />
                </View>
                <StatusBar style="light" />
                <View style={tw`p-2 gap-y-2 bg-secondary`}>
                    <Text textBreakStrategy="highQuality" style={tw`text-justify text-lg font-bold leading-5 mt-1`}>{news.title}</Text>
                    <View style={tw`flex-row justify-between items-center pb-2 border-b-[0.5px] border-neutral-600 overflow-hidden`}>
                        <Text style={tw`flex-1 font-bold text-neutral-600`}>{news.author}</Text>
                        <Text style={tw`text-xs text-neutral-600`}>{new Date(news.publish_date).toLocaleDateString("default", { dateStyle: 'short' })}</Text>
                    </View>
                    {news.summary && <Text textBreakStrategy="highQuality" style={tw`text-justify font-medium text-[15px] text-neutral-600 pb-2 border-b-[0.5px] border-neutral-600`}>{news.summary}</Text>}
                    <Text textBreakStrategy="highQuality" style={tw`font-medium text-base text-justify m-1`}>{news.text}</Text>
                    {news.video && (
                        <Video
                            source={{ uri: news.video }}
                            style={tw`w-full h-46 m-1`}
                            resizeMode={ResizeMode.CONTAIN}
                            useNativeControls
                            shouldPlay={false}
                        />
                    )}
                    <View style={tw`w-20 h-[0.5px] bg-neutral-600 m-3 self-center`} />
                    <ExternalLink href={news.url} style={tw`pb-2`}>
                        <Text style={tw`text-xs text-neutral-600`}>Source: {news.url}</Text>
                    </ExternalLink>
                </View>
            </ScrollView>
        </View>
    )
}

type NavBarProps = {
    hasSaved: boolean;
    setHasSaved: React.Dispatch<React.SetStateAction<boolean>>;
    news: TNews;
}

const NavBar = ({ hasSaved, setHasSaved, news }: NavBarProps) => {
    const { setStackBtnPressed } = useNewsContext();

    const toggleNewsInDB = async () => {
        try {
            const userUUID = await manageStorage.get('userUUID');
            if (!hasSaved) {
                await handleSaveToDb(userUUID!);
            } else {
                await handleDeleteFromDB(userUUID!);
            }
            setHasSaved(!hasSaved);
            setStackBtnPressed(prev => prev + 1);
        } catch (error) {
            console.log(error);
            const message = error instanceof Error ? error.message : "Try again later";
            Alert.alert('Error', message);
        }
    }

    const handleSaveToDb = async (userUUID: string) => {
        try {
            const res = await fetch('https://yu1ia-news4u.netlify.app/api/news', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id: news.id,
                    user_id: userUUID,
                    category_id: categories.indexOf(news.category as string) + 1 || 13,
                    title: news.title,
                    text: news.text,
                    summary: news.summary,
                    source_country: news.source_country,
                    language: news.language,
                    url: news.url,
                    image: news.image,
                    video: news.video,
                    author: news.author,
                    publish_date: news.publish_date
                })
            });
        } catch (error) {
            throw error;
        }
    }

    const handleDeleteFromDB = async (userUUID: string) => {
        try {
            const res = await fetch('https://yu1ia-news4u.netlify.app/api/news', {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ uuid: userUUID, newsId: news.id })
            });
        } catch (error) {
            throw error;
        }
    }


    return (
        <View style={tw`absolute top-10 left-3 right-3 flex-row items-center justify-between`}>
            <TouchableOpacity
                onPress={router.back}
                style={tw`w-[37px] h-[37px] justify-center items-center bg-secondary rounded-full shadow`}
            >
                <FontAwesome name='angle-double-left' size={31} color={colors.tint} style={tw`pr-[3px]`} />

            </TouchableOpacity>
            <TouchableOpacity
                onPress={toggleNewsInDB}
                style={tw`w-[37px] h-[37px] justify-center items-center bg-secondary rounded-full shadow`}
            >
                <MaterialCommunityIcons name={hasSaved ? "layers" : "layers-outline"} size={25} color={colors.tint} />
            </TouchableOpacity>
        </View>
    )
}