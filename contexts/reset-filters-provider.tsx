import { createContext, useContext, useEffect, useMemo, useState } from "react";

type TResetFiltersContext = {
    resetBtnPressed: boolean;
    setResetBtnPressed: React.Dispatch<React.SetStateAction<boolean>>;
}

const ResetFiltersContext = createContext<TResetFiltersContext | null>(null);

export const ResetFiltersContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [resetBtnPressed, setResetBtnPressed] = useState(false);
    

    useEffect(() => {
        if (!resetBtnPressed) return;

        const timerId = setTimeout(() => {
            setResetBtnPressed(false);
        }, 1000)

        return () => {
            clearTimeout(timerId);
        }
    }, [resetBtnPressed])


    const value = useMemo(() => ({
        resetBtnPressed,
        setResetBtnPressed
    }), [resetBtnPressed])

    return (
        <ResetFiltersContext.Provider value={value}>
            {children}
        </ResetFiltersContext.Provider>
    );
}

export const useResetFiltersContext = () => {
    const value = useContext(ResetFiltersContext);

    if (!value) {
        throw new Error(`useResetFiltersContext must be wrapped inside ResetFiltersContextProvider`);
    }

    return value;
}