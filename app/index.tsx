import { ListEmpty } from '@/components/list-empty';
import { ListHeader } from '@/components/list-header';
import { PreviewCard } from '@/components/preview-card';
import { SearchPanel } from '@/components/search-panel/search-panel';
import { colors, INITIAL_FILTERS } from '@/constants';
import { useGetNews } from '@/lib/queries';
import tw from '@/lib/tailwind';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useMemo, useRef, useState } from 'react';
import { FlatList, NativeScrollEvent, TouchableOpacity, View } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';

// author = 'Lawrence Ostlere'


export default function Index() {
    const [headerHeight, setHeaderHeight] = useState(0);
    const [filters, setFilters] = useState(INITIAL_FILTERS);
    const [hideSearchPanel, setHideSearchPanel] = useState(false);
    const flatlistRef = useRef<FlatList>(null);

    const filterValues = useMemo(() => Object.values(filters), [filters]);
    const { data, fetchNextPage, hasNextPage, isFetching, isLoading, isFetchingNextPage } = useGetNews(10, ...filterValues);


    const onScrollUpPress = () => {
        flatlistRef.current?.scrollToOffset({ offset: 0 });
    }

    const onScrollDownPress = () => {
        flatlistRef.current?.scrollToEnd();
    }

    const onEndReached = async () => {
        if (data?.shouldStopPagination || !hasNextPage) return;

        !isFetching && fetchNextPage();
    }

    const onScroll = ({ nativeEvent }: { nativeEvent: NativeScrollEvent }) => {
        const { contentOffset } = nativeEvent;
        setHideSearchPanel(!(contentOffset.y < 700));
    }


    return (
        <View style={tw`flex-1 bg-secondary-100`}>
            <SearchPanel
                setFilters={setFilters}
                setHeaderHeight={setHeaderHeight}
                hide={hideSearchPanel}
            />
            {isLoading || !data ? (
                <Spinner
                    visible={isLoading}
                    textContent={'Loading...'}
                    textStyle={tw`text-white text-lg font-bold`}
                />
            ) : (
                <FlatList
                    ref={flatlistRef}
                    data={data.news}
                    keyExtractor={i => i.id?.toString()}
                    contentContainerStyle={tw`px-3 pt-8 pb-16 gap-4`}
                    renderItem={({ item, index }) => <PreviewCard item={item} isLastItem={index === data.news.length - 1 && isFetchingNextPage} />}
                    onScroll={onScroll}
                    onEndReached={onEndReached}
                    onEndReachedThreshold={0.2}
                    scrollEventThrottle={16}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={<ListEmpty>{data.errorCode === 402 ? 'Daily limit reached' : 'Nothing found 🔎'}</ListEmpty>}
                    ListHeaderComponent={<ListHeader headerHeight={headerHeight} />}
                />
            )}
            {data && data.news.length > 10 && (
                <View style={tw`absolute bottom-3 right-[2px] items-center bg-primary/80 rounded-full shadow`}>
                    <TouchableOpacity
                        onPress={onScrollUpPress}
                        style={tw`w-[30px] h-[30px] justify-center items-center rounded`}
                    >
                        <MaterialCommunityIcons name={"arrow-up-bold-outline"} size={24} color={colors.secondary} />
                    </TouchableOpacity>
                    <View style={tw`w-2 h-2 border-2 border-secondary rounded-full`} />
                    <TouchableOpacity
                        onPress={onScrollDownPress}
                        style={tw`w-[30px] h-[30px] justify-center items-center rounded`}
                    >
                        <MaterialCommunityIcons name={"arrow-down-bold-outline"} size={24} color={colors.secondary} />
                    </TouchableOpacity>
                </View>
            )}
        </View>
    )
}