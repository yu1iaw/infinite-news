import { colors } from '@/constants';
import { useResetFilter } from '@/hooks/useResetFilter';
import tw from '@/lib/tailwind';
import { TFilters } from '@/lib/types';
import { Entypo } from '@expo/vector-icons';
import { impactAsync, ImpactFeedbackStyle, notificationAsync, NotificationFeedbackType } from 'expo-haptics';
import { useMemo, useState } from 'react';
import { Text, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Menu, MenuOption, MenuOptions, MenuTrigger } from 'react-native-popup-menu';
import VerticalSlider from 'rn-vertical-slider';
import { Touchable } from './touchable';


type SentimentFilterProps = {
    setFilters: React.Dispatch<React.SetStateAction<TFilters>>;
}

export const SentimentFilter = ({ setFilters }: SentimentFilterProps) => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [sliderValue, setSliderValue] = useState("0.0");
    const [indicatorValue, setIndicatorValue] = useState("0.0");
    useResetFilter(() => {
        setSliderValue('0.0');
        setIndicatorValue('0.0');
    })

    const calculateColors = () => {
        let minimumTrackTintColor = '#000';
        let maximumTrackTintColor = '#e6bdb6';
        if (+indicatorValue >= 0.5) {
            minimumTrackTintColor = maximumTrackTintColor;
        } else if (+indicatorValue >= 0) {
            minimumTrackTintColor = '#dbb4ad';
        } else if (+indicatorValue < 0) {
            minimumTrackTintColor = `#cea9a3`;
        }
        return { minimumTrackTintColor, maximumTrackTintColor };
    };

    const { maximumTrackTintColor, minimumTrackTintColor } = useMemo(calculateColors, [indicatorValue]);

    const onTriggerPress = () => {
        setIsPopupOpen(true);
        impactAsync(ImpactFeedbackStyle.Rigid);
    }

    const onTriggerLongPress = () => {
        if (!+sliderValue) return;

        setFilters(prev => ({ ...prev, sentiment: undefined }));
        setSliderValue('0.0');
        setIndicatorValue('0.0');
        notificationAsync(NotificationFeedbackType.Warning);
    }

    const onBackdropPress = () => {
        setFilters(prev => ({ ...prev, sentiment: sliderValue }));
        setIsPopupOpen(false);
    }


    return (
        <Menu
            opened={isPopupOpen}
            onBackdropPress={onBackdropPress}
        >
            <MenuTrigger>
                <Touchable
                    onPress={onTriggerPress}
                    onLongPress={onTriggerLongPress}
                    activeFilterStyle={!!+sliderValue}
                >
                    <Entypo name={+sliderValue > 0 ? 'emoji-happy' : +sliderValue < 0 ? 'emoji-sad' : 'emoji-neutral'} size={18} color={+sliderValue ? colors.accent : colors.tint} />
                </Touchable>
            </MenuTrigger>
            <MenuOptions customStyles={{ optionsContainer: tw`bg-secondary rounded-md w-22` }}>
                <GestureHandlerRootView>
                    <MenuOption>
                        <VerticalSlider
                            value={+sliderValue}
                            onChange={(value) => setIndicatorValue(value.toFixed(1))}
                            onComplete={(value) => setSliderValue(value.toFixed(1))}
                            height={165}
                            width={35}
                            step={0.1}
                            min={-1}
                            max={1}
                            borderRadius={6}
                            minimumTrackTintColor={minimumTrackTintColor}
                            maximumTrackTintColor={maximumTrackTintColor}
                            showIndicator
                            renderIndicator={() => (
                                <View style={tw`w-[72px] items-end`}>
                                    <Entypo name={+indicatorValue > 0 ? 'emoji-happy' : +indicatorValue < 0 ? 'emoji-sad' : 'emoji-neutral'} size={15} color={colors.accent} style={tw`-mb-1 mr-1`} />
                                    <Text style={tw`font-bold text-base text-accent`}>{indicatorValue}</Text>
                                </View>
                            )}
                            sliderStyle={tw`rounded-md bg-secondary-100 border border-white`}
                        />
                    </MenuOption>
                </GestureHandlerRootView>
            </MenuOptions>
        </Menu>
    )
}