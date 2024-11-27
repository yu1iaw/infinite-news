import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { TNews, TNewsData } from "./types";
import { concatUrl } from "./utils";


export const fetchNews = async (...rest: (string | number)[]): Promise<TNewsData> => {
    try {
        const url = await concatUrl(...rest);
        const response = await fetch(url,
            {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${process.env.EXPO_PUBLIC_SULU_BEARER_KEY}`
                }
            }
        );

        if (!response.ok) throw `Failed to fetch news, ${response.status}`;
                
        return response.json();
    } catch (error) {
        console.log(error);
        // throw error;
        return {
            available: 0,
            news: [],
            offset: 0,
            number: 10,
            statusCode: typeof error === "string" ? +error.slice(-3) : undefined
        };
    }
}

export const useGetNews = (number = 10, text = '', sourceCountry = '', lang = 'en', sentiment = '0.0', date = '', newsSource = '', category = '', author = '', entity = '', sortDirection = '', location = '') => {
    return useInfiniteQuery({
        queryKey: ["news", { number, text, sourceCountry, lang, sentiment, date, newsSource, category, author, entity, sortDirection, location }],
        queryFn: ({ pageParam }) => fetchNews(pageParam, number, text, sourceCountry, lang, +sentiment, date, newsSource, category, author, entity, sortDirection, location),
        initialPageParam: 0,
        getNextPageParam: (lastPage, pages, lastPageParam) => {
            // return lastPage.news.length ? lastPageParam + 10 : undefined;
            return lastPageParam < lastPage.available ? lastPageParam + 10 : undefined;
        },
        select: (data) => {
            const news = data.pages.flatMap(i => i.news);
            const shouldStopPagination = data.pageParams.at(-1) as number + 10 >= Number(data.pages[0].available);
            const errorCode = data.pages[0].statusCode;

            return {
                news,
                shouldStopPagination,
                errorCode
            }
        },
        staleTime: 15 * 60 * 1000,
    })
}


const fetchSingleNews = async (id: string): Promise<TNews | null> => {
    try {
        const response = await fetch(`https://world-news-api.p.sulu.sh/retrieve-news?ids=${id}`,
            {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${process.env.EXPO_PUBLIC_SULU_BEARER_KEY}`
                }
            }
        );

        if (!response.ok) throw Error(`Failed to fetch single news, ${response.status}`);
        const data = await response.json();
        return data.news.length ? data.news[0] : null;
        
    } catch (error) {
        console.log(error);
        return null;
    }
}

export const useGetSingleNews = (newsId: string) => {
    return useQuery({
        queryKey: ['singleNews', newsId],
        queryFn: () => fetchSingleNews(newsId),
        enabled: !!newsId
    })
}

