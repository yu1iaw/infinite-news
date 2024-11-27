import { colors } from '@/constants';
import { useResetFilter } from '@/hooks/useResetFilter';
import { TFilters } from '@/lib/types';
import Octicons from '@expo/vector-icons/Octicons';
import { impactAsync, ImpactFeedbackStyle, notificationAsync, NotificationFeedbackType } from 'expo-haptics';
import { useState } from 'react';
import { Touchable } from './touchable';



type SortingFiltersProps = {
    setFilters: React.Dispatch<React.SetStateAction<TFilters>>;
}

export const SortingFilter = ({ setFilters }: SortingFiltersProps) => {
    const [activeDirection, setActiveDirection] = useState("");
    useResetFilter(() => setActiveDirection(''));

    const handleSortingPress = () => {
        setFilters(prev => ({ ...prev, sortDirection: prev.sortDirection ? undefined : "DESC" }));
        setActiveDirection(activeDirection ? "" : "DESC");
        activeDirection ? notificationAsync(NotificationFeedbackType.Warning) : impactAsync(ImpactFeedbackStyle.Rigid);
    }

    return (
        <Touchable onPress={handleSortingPress} activeFilterStyle={!!activeDirection}>
            <Octicons name={'sort-desc'} size={18} color={activeDirection ? colors.accent : colors.tint} />
        </Touchable>
    )

}


