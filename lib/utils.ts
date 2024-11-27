import AsyncStorage from '@react-native-async-storage/async-storage';


const baseUrl = `https://world-news-api.p.sulu.sh/search-news`;

const generateCoords = async (location: string) => {
    try {
        const response = await fetch(`https://api.worldnewsapi.com/geo-coordinates?location=${encodeURIComponent(location)}`, {
            method: "GET",
            headers: {
                'x-api-key': process.env.EXPO_PUBLIC_WOLRD_NEWS_API_KEY!
            }
        });
        if (!response.ok) throw Error('Failed to fetch location');

        const data = await response.json();
        if (!data) throw 'error';

        return `${data.latitude},${data.longitude},100`;
    } catch (error) {
        console.log(error);
        return '51.509865,-0.118092,100';
    }
}

export const concatUrl = async (...rest: any[]) => {    
    const [offset, number, text, sourceCountry, lang, sentiment, date, newsSource, category, author, entity, sortDirection, location] = rest;
    
    let url = baseUrl + `?number=${number}&offset=${offset}&sort=publish-time`;

    if (text) {
        url += `&text=${encodeURIComponent(text)}`;
    }
    if (sourceCountry) {
        url += `&source-country=${sourceCountry}`;
    }
    if (sentiment) {
        url += `&min-sentiment=${sentiment}`;
    }
    if (date) {
        url += `&earliest-publish-date=${date}`;
    }
    if (newsSource) {
        url += `&news-sources=${encodeURIComponent(newsSource)}`;
    }
    if (category) {
        url += `&categories=${category}`;
    }
    if (author) {
        url += `&authors=${encodeURIComponent(author)}`;
    } 
    if (entity) {
        url += `&entities=${encodeURIComponent(entity)}`;
    }
    if (sortDirection) {
        url += `&sort-direction=${sortDirection}`
    }
    if (location) {
        let coords = await generateCoords(location);

        url += `&location-filter=${coords}`;
    }
    if (lang) {
        url += `&language=${lang}`;
    }
    
    console.log('url: ', url);
    return url;
}

export const checkImageUrlFormat = (url: string) => {
    const regex: RegExp = /\.(png|jpe?g|gif|webp)($|\?{1}\w+)/ig;
    return regex.test(url.trim());
}

export const manageStorage = {
    get: async (key: string) => {
        const userUUID = await AsyncStorage.getItem(key);
        return userUUID;
    },
    set: async (key: string, value: string) => {
        await AsyncStorage.setItem(key, value);
    }
}