import { Header } from "@/components/header";
import { ListByCategory } from "@/components/list-by-category";
import { ListEmpty } from "@/components/list-empty";
import { categories } from "@/constants";
import { useNewsContext } from "@/contexts/news-provider";
import tw from '@/lib/tailwind';
import { TNewsFromDB } from "@/lib/types";
import { manageStorage } from "@/lib/utils";
import { useEffect, useState } from "react";
import { View } from "react-native";
import Spinner from "react-native-loading-spinner-overlay";
import { ScrollView as VirtualizedView } from "react-native-virtualized-view";


export default function News() {
    const [news, setNews] = useState<{ [key: string]: TNewsFromDB[] }>({});
    const [isLoading, setIsLoading] = useState(true);
    const { stackBtnPressed } = useNewsContext();


    useEffect(() => {
        (async () => {
            try {
                const userUUID = await manageStorage.get('userUUID');
                const res = await fetch(`https://yu1ia-news4u.netlify.app/api/news?uuid=${userUUID}`);
                const { data }: { data: TNewsFromDB[] } = await res.json();

                const news = data.reduce((acc: { [key: string]: TNewsFromDB[] }, curr) => {
                    const category = categories[curr.category_id - 1];
                    if (acc[category]) {
                        acc[category].push(curr);
                    } else {
                        acc[category] = [curr];
                    }
                    return acc;
                }, {})

                setNews(news);
            } catch (error) {
                console.log(error);
            } finally {
                setIsLoading(false);
            }
        })()
    }, [stackBtnPressed])


    return (
        <View style={tw`flex-1 bg-secondary-100`}>
            <Header />
            <VirtualizedView
                showsVerticalScrollIndicator={false}
                style={tw`flex-1 mt-[0.5px]`}
                decelerationRate="fast"
                snapToAlignment="start"
                snapToInterval={332}
            >
                {Object.entries(news).length > 0 ? Object.entries(news).map((item, index) => (
                    <ListByCategory
                        key={item[0]}
                        index={index}
                        categoryName={item[0]}
                        data={item[1]}
                        isLast={index === Object.entries(news).length - 1}
                    />
                )) : isLoading ? (
                    <Spinner
                        visible={isLoading}
                        textContent={'Loading...'}
                        textStyle={tw`text-white text-lg font-bold`}
                    />
                ) : (
                    <View style={tw`justify-end h-[80px]`}>
                        <ListEmpty>Empty list yet. Add your first news.</ListEmpty>
                    </View>
                )}
            </VirtualizedView>
        </View>
    )
}

