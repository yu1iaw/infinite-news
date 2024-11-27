import tw from '@/lib/tailwind';
import LottieView from 'lottie-react-native';
import { View } from 'react-native';


type ListHeaderProps = {
    headerHeight: number;
}

export const ListHeader = ({ headerHeight }: ListHeaderProps) => {
    return (
        <View style={tw`h-[${headerHeight}px] items-center`}>
            <LottieView
                source={require('@/assets/images/loading.json')}
                autoPlay
                loop
                style={tw`w-[150px] h-[150px]`}
            />
        </View>
    )
}