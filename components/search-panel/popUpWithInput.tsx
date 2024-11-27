import { colors, countryCodes, languageCodes } from '@/constants';
import { useResetFilter } from '@/hooks/useResetFilter';
import tw from '@/lib/tailwind';
import { TFilters } from '@/lib/types';
import { impactAsync, ImpactFeedbackStyle, notificationAsync, NotificationFeedbackType } from 'expo-haptics';
import { useState } from 'react';
import { Text, TextInput, TextInputEndEditingEventData, View } from 'react-native';
import { Menu, MenuOption, MenuOptions, MenuTrigger } from 'react-native-popup-menu';
import { Touchable } from './touchable';


type PopUpWithInputProps = {
    setFilters: React.Dispatch<React.SetStateAction<TFilters>>;
    Icon: React.ElementType;
    name: string;
    size: number;
    filterName: keyof TFilters;
}

export const PopUpWithInput = ({ setFilters, Icon, name, size, filterName }: PopUpWithInputProps) => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [popupInputValue, setPopupInputValue] = useState("");
    useResetFilter(() => setPopupInputValue(''));
    
    let placeholder: string;
    switch (filterName) {
        case "author":
            placeholder = 'John Doe';
            break;
        case "lang":
            placeholder = 'English';
            break;
        case "sourceCountry":
            placeholder = 'United Kingdom';
            break;
        case "newsSource":
            placeholder = 'https://www.bbc.co.uk';
            break;
        case "entity":
            placeholder = 'PER:Léon Marchand';
            break;
        case "location":
            placeholder = 'Tokyo, Japan';
            break;
        default:
            placeholder = '';
    }

    const onTriggerPress = () => {
        setIsPopupOpen(true);
        impactAsync(ImpactFeedbackStyle.Rigid);
    }

    const onTriggerLongPress = () => {
        if (!popupInputValue) return;

        setFilters(prev => ({ ...prev, [filterName]: undefined }));
        setPopupInputValue('');
        notificationAsync(NotificationFeedbackType.Warning);
    }

    const onEndEditing = ({ nativeEvent }: { nativeEvent: TextInputEndEditingEventData }) => {
        const { text } = nativeEvent;
        setFilters(prev => {
            const langOrSourceCountryFilter = filterName === "lang" || filterName === "sourceCountry";
            const langFilter = filterName === "lang";
            return { ...prev, [filterName]: !langOrSourceCountryFilter ? text : langFilter ? languageCodes[text] : countryCodes[text]}
        })
        setPopupInputValue(text);
        setIsPopupOpen(false);
    }

    return (
        <Menu
            opened={isPopupOpen}
            onBackdropPress={() => setIsPopupOpen(false)}
        >
            <MenuTrigger>
                <Touchable
                    onPress={onTriggerPress}
                    onLongPress={onTriggerLongPress}
                    activeFilterStyle={!!popupInputValue && !isPopupOpen}
                >
                    <Icon name={name} size={size} color={!!popupInputValue && !isPopupOpen ? colors.accent : colors.tint} />
                </Touchable>
            </MenuTrigger>
            <MenuOptions customStyles={{ optionsContainer: tw`bg-secondary rounded-md` }}>
                <MenuOption>
                    {filterName === "entity" && (
                        <View style={tw`flex-row flex-wrap gap-1 justify-center my-2`}>
                            <View style={tw`bg-primary p-1 px-2 rounded-md shadow-sm`}>
                                <Text style={tw`text-accent text-xs`}>LOC:Italy</Text>
                            </View>
                            <View style={tw`bg-primary p-1 px-2 rounded-md shadow-sm`}>
                                <Text style={tw`text-accent text-xs`}>PER:Jude Law</Text>
                            </View>
                            <View style={tw`bg-primary p-1 px-2 rounded-md shadow-sm`}>
                                <Text style={tw`text-accent text-xs`}>ORG:Netflix</Text>
                            </View>
                        </View>
                    )}
                    <TextInput
                        defaultValue={popupInputValue}
                        placeholder={placeholder}
                        placeholderTextColor={colors.tint}
                        style={tw`text-accent p-2 px-3 border border-white bg-secondary-100 rounded-md`}
                        onEndEditing={onEndEditing}
                        autoCapitalize={filterName === "newsSource" ? "none" : undefined}
                        autoCorrect={!(filterName === "newsSource")}
                    />
                </MenuOption>
            </MenuOptions>
        </Menu>
    )
}