import { colors } from '@/constants';
import { useResetFilter } from '@/hooks/useResetFilter';
import tw from '@/lib/tailwind';
import { TFilters } from '@/lib/types';
import { Entypo } from '@expo/vector-icons';
import { useRef } from 'react';
import { TextInput, TextInputEndEditingEventData, TouchableOpacity, View } from 'react-native';


type SearchInputProps = {
    setFilters: React.Dispatch<React.SetStateAction<TFilters>>;
}

export const SearchInput = ({ setFilters }: SearchInputProps) => {
    const inputRef = useRef<TextInput>(null);
    const inputValueRef = useRef('');
    useResetFilter(() => {
        inputValueRef.current = '';
        inputRef.current?.clear();
    })


    const onEndEditing = ({ nativeEvent }: { nativeEvent: TextInputEndEditingEventData }) => {
        if (!nativeEvent.text) return;

        inputValueRef.current = nativeEvent.text;
        setFilters(prev => ({ ...prev, text: nativeEvent.text }));
    }

    const onCrossBtnPress = () => {
        inputValueRef.current && setFilters(prev => ({ ...prev, text: undefined }));
        inputValueRef.current = '';
        inputRef.current?.clear();
    }

    return (
        <View style={tw`flex-row flex-1 items-center px-3 bg-secondary rounded-md`}>
            <Entypo name="magnifying-glass" size={18} color={colors.tint} />
            <TextInput
                ref={inputRef}
                style={tw`flex-1 p-2 text-accent`}
                placeholderTextColor={colors.tint}
                placeholder='Search'
                onEndEditing={onEndEditing}
            />
            <TouchableOpacity onPress={onCrossBtnPress}>
                <Entypo name="cross" size={18} color={colors.tint} />
            </TouchableOpacity>
        </View>
    )
}