export type TNewsData = {
    offset: number;
    number: number;
    available: number;
    news: TNews[];
    statusCode?: number;
}

export type TNews = {
    summary?: string;
    image?: string;
    sentiment?: number;
    author?: string;
    language: string;
    video?: string;
    title: string;
    url: string;
    source_country: string;
    id: number;
    text: string;
    category?: string;
    publish_date: string;
    authors?: string[];
}

export type TFilters = {
    text?: string;
    sourceCountry?: string;
    lang?: string;
    sentiment?: string;
    date?: string;
    newsSource?: string;
    category?: string;
    author?: string;
    entity?: string;
    sortDirection?: string;
    location?: string;
}

export type TNewsFromDB = {
    news_id: number;
    id: number;
    category_id: number;
    author?: string;
    image: string;
    language: string;
    publish_date: Date;
    source_country: string;
    summary?: string;
    title: string;
    text: string;
    url: string;
    user_id: string;
    video?: string;
}

export type TSortDirections = 'DESC' | 'ASC';