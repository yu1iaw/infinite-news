import tw from '@/lib/tailwind';
import { TouchableOpacity } from 'react-native';


type TouchableProps = {
    children: React.ReactNode;
    onPress?: () => void;
    onLongPress?: () => void;
    activeFilterStyle?: boolean;
}

export const Touchable = ({ children, onPress, onLongPress, activeFilterStyle }: TouchableProps) => (
    <TouchableOpacity
        onPress={onPress}
        onLongPress={onLongPress}
        style={tw.style(`bg-secondary w-[34px] h-[34px] justify-center items-center rounded-md shadow`, activeFilterStyle && 'shadow-none')}
    >
        {children}
    </TouchableOpacity>
)