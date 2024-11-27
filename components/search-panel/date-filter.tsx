import { colors } from '@/constants';
import { useResetFilter } from '@/hooks/useResetFilter';
import { TFilters } from '@/lib/types';
import { FontAwesome } from '@expo/vector-icons';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { impactAsync, ImpactFeedbackStyle, notificationAsync, NotificationFeedbackType } from 'expo-haptics';
import { useState } from 'react';
import { Touchable } from './touchable';


type DateFilterProps = {
    setFilters: React.Dispatch<React.SetStateAction<TFilters>>;
}

export const DateFilter = ({ setFilters }: DateFilterProps) => {
    const [date, setDate] = useState<Date | undefined>(undefined);
    useResetFilter(() => setDate(undefined));


    const showDatePicker = () => {
        impactAsync(ImpactFeedbackStyle.Rigid);

        DateTimePickerAndroid.open({
            value: date ?? new Date(),
            onChange: (event, selectedDate) => {
                if (event.type === "dismissed") return;
                
                const date = selectedDate as Date;
                setDate(date);
                setFilters(prev => {
                    const year = date.getFullYear();
                    const month = `0${date.getMonth() + 1}`.slice(-2);
                    const day = `0${date.getDate()}`.slice(-2);
                    return { ...prev, date: `${year}-${month}-${day}` };
                })
            },
            mode: "date",
            is24Hour: true,
        });
    }

    const resetDateFilter = () => {
        if (!date) return;
        
        setFilters(prev => ({ ...prev, date: undefined }));
        setDate(undefined);
        notificationAsync(NotificationFeedbackType.Warning);
    }


    return (
        <Touchable
            onPress={showDatePicker}
            onLongPress={resetDateFilter}
            activeFilterStyle={!!date}
        >
            <FontAwesome name='calendar' size={16} color={date ? colors.accent : colors.tint} />
        </Touchable>

    )
}