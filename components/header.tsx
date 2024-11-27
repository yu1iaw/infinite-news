import { colors } from '@/constants';
import tw from '@/lib/tailwind';
import Feather from '@expo/vector-icons/Feather';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Image } from 'expo-image';
import { router, usePathname } from 'expo-router';
import { TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';


export const Header = () => {            
    const pathname = usePathname();
    const { top } = useSafeAreaInsets();

    return (
        <View style={tw`bg-primary pt-[${top}px] z-20`}>
            <View style={tw`flex-row justify-between items-center px-3`}>
                {pathname === "/news" && (
                    <TouchableOpacity onPress={router.back} style={tw`p-2`}>
                        <FontAwesome name='angle-double-left' size={39} color={colors.secondary} />
                    </TouchableOpacity>
                )}
                <Image
                    source={require('@/assets/images/coollogo.png')}
                    style={tw`w-39 h-20`}
                    contentFit="contain"
                />
                {pathname === '/' && (
                    <TouchableOpacity onPress={() => router.navigate('/news')} style={tw`p-2`}>
                        <Feather name='layers' size={24} color={colors.secondary} />
                    </TouchableOpacity>
                )}
            </View>
        </View>
    )
}