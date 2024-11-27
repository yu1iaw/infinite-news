import { categories } from '@/constants';
import { useResetFilter } from '@/hooks/useResetFilter';
import tw from '@/lib/tailwind';
import { TFilters } from '@/lib/types';
import { impactAsync, ImpactFeedbackStyle, notificationAsync, NotificationFeedbackType } from 'expo-haptics';
import { useState } from 'react';
import { ScrollView, Text, TouchableOpacity } from 'react-native';


type CategoriesFilterProps = {
    setFilters: React.Dispatch<React.SetStateAction<TFilters>>;
}

export const CategoriesFilter = ({ setFilters }: CategoriesFilterProps) => {
    const [activeCategory, setActiveCategory] = useState("sports");
    useResetFilter(() => setActiveCategory(''));


    const handleFilterPress = (c: string) => {
        setFilters(prev => ({ ...prev, category: prev.category === c ? undefined : c }));
        setActiveCategory(activeCategory === c ? "" : c);
        activeCategory === c ? notificationAsync(NotificationFeedbackType.Warning) : impactAsync(ImpactFeedbackStyle.Rigid);
    }

    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={tw`gap-x-[15px] px-3 py-5`}
        >
            {categories.map((c, _i) => (
                <TouchableOpacity
                    key={c}
                    onPress={() => handleFilterPress(c)}
                    style={tw.style(`bg-secondary p-1 px-2 rounded-md shadow`, activeCategory === c && 'shadow-none')}
                >
                    <Text style={tw.style(`text-accent`, activeCategory === c && 'font-bold')}>{c}</Text>
                </TouchableOpacity>
            ))}
        </ScrollView>
    )
}