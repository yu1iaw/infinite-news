import tw from '@/lib/tailwind';
import { TNewsFromDB } from '@/lib/types';
import { Motion } from '@legendapp/motion';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { memo } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';


type CategoryCardProps = {
    item: TNewsFromDB;
    index: number;
    activeIndex: number;
}

export const CategoryCard = memo(({ item, index, activeIndex }: CategoryCardProps) => {    
    return (
        <Motion.View
            animate={{ scale: activeIndex === index ? 1.05 : 0.98, elevation: activeIndex === index ? 3 : 2 }}
            transition={{ type: "spring", stiffness: 135, damping: 11 }}
            style={tw`bg-secondary gap-y-2 w-44 rounded-md overflow-hidden shadow`}
        >
            <TouchableOpacity onPress={() => router.navigate(`/news/${item.id}`)} style={tw`flex-1`}>
                <View>
                    <Image
                        source={item.image}
                        style={tw`w-full h-40`}
                        placeholderContentFit="cover"
                        placeholder={{ uri: 'https://img.icons8.com/?size=800&id=122835&format=png&color=000000' }}
                    />
                    <Text style={tw`text-neutral-600 bg-secondary text-xs self-end absolute bottom-0 px-1`}>{new Date(item.publish_date).toLocaleDateString('default', { dateStyle: "short" })}</Text>
                </View>
                <View style={tw`px-2 pb-2`}>
                    <Text
                        numberOfLines={4}
                        style={tw`font-bold text-[15px]`}
                    >
                        {item.title}
                    </Text>
                </View>
            </TouchableOpacity>
        </Motion.View>
    )
})