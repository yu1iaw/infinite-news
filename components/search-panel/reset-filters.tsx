import { colors, INITIAL_FILTERS } from '@/constants';
import { useResetFiltersContext } from '@/contexts/reset-filters-provider';
import { TFilters } from '@/lib/types';
import Entypo from '@expo/vector-icons/Entypo';
import { notificationAsync, NotificationFeedbackType } from 'expo-haptics';
import { Touchable } from './touchable';


type ResetFiltersProps = {
    setFilters: React.Dispatch<React.SetStateAction<TFilters>>;
}

export const ResetFilters = ({ setFilters }: ResetFiltersProps) => {
    const { setResetBtnPressed } = useResetFiltersContext();

    const handleResetPress = () => {
        setFilters({ ...INITIAL_FILTERS, category: undefined });
        setResetBtnPressed(true);
        notificationAsync(NotificationFeedbackType.Warning);
    }

    return (
        <Touchable onPress={handleResetPress}>
            <Entypo name='cw' size={19} color={colors.tint} />
        </Touchable>
    )
}