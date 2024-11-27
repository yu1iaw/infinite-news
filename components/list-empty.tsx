import tw from '@/lib/tailwind';
import { Text } from 'react-native';


type ListEmptyProps = {
    children: React.ReactNode;
}

export const ListEmpty = ({ children }: ListEmptyProps) => {
    return (
        <Text style={tw`text-lg text-neutral-600 text-center tracking-wide leading-10`}>
            {children}
        </Text>
    )
}