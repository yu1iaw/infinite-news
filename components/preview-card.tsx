import { colors } from '@/constants';
import tw from '@/lib/tailwind';
import { TNews } from '@/lib/types';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import { Motion } from '@legendapp/motion';
import { Image } from 'expo-image';
import { Link, router } from 'expo-router';
import { memo } from 'react';
import { ActivityIndicator, Easing, Text, TouchableOpacity, View } from 'react-native';


type PreviewCardProps = {
    item: TNews;
    isLastItem: boolean;
}

export const PreviewCard = memo(({ item, isLastItem }: PreviewCardProps) => {    
    return (
        <Motion.View
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
                opacity: {
                    type: "tween", duration: 400, easing: Easing.in(Easing.cubic)
                },
                scale: {
                    type: "tween", duration: 350, easing: Easing.elastic(1.1)
                }
            }}
        >
            <View style={tw`p-2 rounded-lg bg-primary shadow-sm`}>
                <View>
                    <Image
                        source={{ uri: item.image }}
                        style={tw`w-full h-[250px] rounded-t-md bg-[#FFF0F5]`}
                        placeholder={{ uri: 'https://img.icons8.com/?size=800&id=122835&format=png&color=000000' }}
                    />
                    <TouchableOpacity
                        onPress={() => router.navigate(`/news/${item.id}`)}
                        activeOpacity={0.6}
                        style={tw`absolute left-0 bottom-0 p-1 bg-secondary/70`}
                    >
                        <SimpleLineIcons name="size-fullscreen" size={24} color="#525252" />
                    </TouchableOpacity>
                    <Text style={tw`text-neutral-600 bg-secondary text-xs self-end absolute bottom-0 px-1`}>{new Date(item.publish_date).toLocaleDateString('default', { dateStyle: "short" })}</Text>
                </View>
                <View style={tw`p-2 gap-y-2 bg-secondary rounded-b-md`}>
                    <Text textBreakStrategy="highQuality" numberOfLines={2} style={tw`text-lg font-bold leading-5 text-justify`}>{item.title}</Text>
                    <Text numberOfLines={3} textBreakStrategy="highQuality" style={tw`font-medium text-[15px] text-justify`}>{item.summary}</Text>
                    <Motion.View
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ type: "tween", duration: 200, delay: 400, easing: Easing.elastic(2) }}
                    >
                        <Link
                            href={`/news/${item.id}`}
                            style={tw`self-center bg-primary px-2 shadow-sm rounded-md text-[seashell] text-lg font-semibold`}
                        >
                            More details
                        </Link>
                    </Motion.View>
                </View>
            </View>
            {isLastItem && (
                <View style={tw`items-center mt-4`}>
                    <ActivityIndicator size="large" color={colors.primary} />
                </View>
            )}
        </Motion.View>
    )
})