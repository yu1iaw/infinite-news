import tw from '@/lib/tailwind';
import { TFilters } from '@/lib/types';
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Octicons from '@expo/vector-icons/Octicons';
import { Motion } from '@legendapp/motion';
import { memo, useState } from 'react';
import { LayoutChangeEvent, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CategoriesFilter, DateFilter, PopUpWithInput, ResetFilters, SearchInput, SentimentFilter, SortingFilter } from '.';
import { Header } from '../header';


type SearchPanelProps = {
    setHeaderHeight: React.Dispatch<React.SetStateAction<number>>;
    setFilters: React.Dispatch<React.SetStateAction<TFilters>>;
    hide?: boolean;
}

export const SearchPanel = memo(({ setHeaderHeight, setFilters, hide }: SearchPanelProps) => {
    const [height, setHeight] = useState(0);
    const { top } = useSafeAreaInsets();

    const onLayout = (e: LayoutChangeEvent) => {        
        const { nativeEvent: { layout } } = e;
        setHeight(layout.height);
        setHeaderHeight(layout.height);
    }

    return (
        <>
            <Header />

            <Motion.View
                animate={{ y: !hide ? 0 : -height }}
                transition={{ type: "spring", overshootClamping: true, tension: 5 }}
                onLayout={onLayout}
                style={tw`absolute top-20 left-0 right-0 mt-[${top}px] bg-primary border-t-[0.5px] border-secondary-100 z-10`}
            >
                <View style={tw`flex-row flex-wrap justify-between items-center gap-4 px-3 py-5`}>
                    <PopUpWithInput
                        filterName="lang"
                        Icon={FontAwesome}
                        name="language"
                        size={18}
                        setFilters={setFilters}
                    />
                    <PopUpWithInput
                        filterName='sourceCountry'
                        Icon={Ionicons}
                        name="globe-outline"
                        size={18}
                        setFilters={setFilters}
                    />
                    <DateFilter setFilters={setFilters} />

                    <PopUpWithInput
                        filterName='location'
                        Icon={MaterialIcons}
                        name="location-searching"
                        size={19}
                        setFilters={setFilters}
                    />
                    <PopUpWithInput
                        filterName="author"
                        Icon={Octicons}
                        name="person"
                        size={19}
                        setFilters={setFilters}
                    />
                    <PopUpWithInput
                        filterName='newsSource'
                        Icon={Ionicons}
                        name="newspaper-outline"
                        size={18}
                        setFilters={setFilters}
                    />
                    <PopUpWithInput
                        filterName='entity'
                        Icon={AntDesign}
                        name="tagso"
                        size={21}
                        setFilters={setFilters}
                    />

                    <SentimentFilter setFilters={setFilters} />
                    <SortingFilter setFilters={setFilters} />

                    <SearchInput setFilters={setFilters} />
                    <ResetFilters setFilters={setFilters} />
                </View>

                <CategoriesFilter setFilters={setFilters} />
            </Motion.View>
        </>
    )
})


