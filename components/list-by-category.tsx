import { categories, colors } from '@/constants';
import tw from '@/lib/tailwind';
import { TNewsFromDB } from '@/lib/types';
import { manageStorage } from '@/lib/utils';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AnimatePresence, Motion } from "@legendapp/motion";
import { notificationAsync, NotificationFeedbackType } from 'expo-haptics';
import { useEffect, useState } from 'react';
import { Dimensions, Easing, FlatList, Text, ViewToken } from 'react-native';
import { CategoryCard } from './category-card';


const { width } = Dimensions.get("screen");

type ListByCategoryProps = {
    categoryName: string;
    data: TNewsFromDB[];
    index: number;
    isLast: boolean;
}

export const ListByCategory = ({ categoryName, data, index, isLast }: ListByCategoryProps) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isLongPress, setIsLongPress] = useState(false);
    const [exitMode, setExitMode] = useState(false);


    useEffect(() => {
        if (!isLongPress) return;

        const timerId = setTimeout(async () => {
            try {
                const userUUID = await manageStorage.get('userUUID');
                fetch('https://yu1ia-news4u.netlify.app/api/news', {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ uuid: userUUID, categoryId: categories.indexOf(categoryName) + 1 })
                });
                notificationAsync(NotificationFeedbackType.Warning);
                setExitMode(true);
            } catch (error) {
                console.log(error);
            }
        }, 700)

        return () => {
            clearTimeout(timerId);
        }
    }, [isLongPress])


    const onViewableItemsChanged = ({ viewableItems }: { viewableItems: ViewToken<TNewsFromDB>[] }) => {
        setActiveIndex(viewableItems.at(-1)?.index || 0);
    }

    const onLongPress = () => {
        setIsLongPress(true);
    }

    const onTouchEnd = () => {
        setIsLongPress(false);
    }

    return (
        <AnimatePresence>
            {!exitMode && (
                <Motion.View
                    key="A"
                    initial={{ x: index % 2 ? width : -width }}
                    animate={{ x: 0 }}
                    exit={{ x: -width }}
                    transition={{ type: "tween", duration: 400, delay: index * 150, easing: Easing.elastic(0.8) }}
                    style={tw.style(isLast && 'mb-10')}
                >
                    <Motion.Pressable onLongPress={onLongPress} onTouchEnd={onTouchEnd}>
                        <MaterialCommunityIcons style={tw`absolute right-7 bottom-[10px]`} name="delete-clock-outline" size={27} color={colors.tint} />
                        <Motion.View
                            whileTap={{ x: -width + 40 }}
                            transition={{ type: "tween", duration: 1000, delay: 100, easing: "linear" }}
                            style={tw`bg-primary h-[50px] justify-center px-5`}
                        >
                            <Text style={tw.style(`text-[#c3928b] text-2xl`, { textShadowColor: "#fceae5", textShadowOffset: { height: 1.5, width: 1 }, textShadowRadius: 1 })}>{categoryName.toUpperCase()}</Text>
                        </Motion.View>
                    </Motion.Pressable>
                    <FlatList
                        data={data}
                        viewabilityConfig={{ itemVisiblePercentThreshold: 95 }}
                        onViewableItemsChanged={onViewableItemsChanged}
                        renderItem={({ item, index }) => <CategoryCard item={item} index={index} activeIndex={activeIndex} />}
                        contentContainerStyle={tw`p-5 h-[282px] gap-x-5`}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={i => i.news_id.toString()}
                    />
                </Motion.View>
            )}
        </AnimatePresence>
    )
}

