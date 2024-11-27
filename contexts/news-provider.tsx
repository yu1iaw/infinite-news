import { createContext, useContext, useMemo, useState } from "react";

type TNewsContext = {
    stackBtnPressed: number;
    setStackBtnPressed: React.Dispatch<React.SetStateAction<number>>;
}
const NewsContext = createContext<TNewsContext | null>(null);


export const NewsContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [stackBtnPressed, setStackBtnPressed] = useState(0);

    const value = useMemo(() => ({
        stackBtnPressed,
        setStackBtnPressed
    }), [stackBtnPressed])

    return (
        <NewsContext.Provider value={value}>
            {children}
        </NewsContext.Provider>
    );
}

export const useNewsContext = () => {
    const value = useContext(NewsContext);

    if (!value) {
        throw new Error(`useNewsContext must be wrapped inside NewsContextProvider`);
    }

    return value;
}