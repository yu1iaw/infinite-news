import { useResetFiltersContext } from "@/contexts/reset-filters-provider";
import { useEffect } from "react";


export const useResetFilter = (callback: () => void) => {
    const { resetBtnPressed } = useResetFiltersContext();

    useEffect(() => {
        if (!resetBtnPressed) return;
        callback();
        
    }, [resetBtnPressed])
}