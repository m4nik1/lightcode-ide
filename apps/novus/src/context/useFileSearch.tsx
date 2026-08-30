import { createContext, ReactNode, useContext, useState } from "react";

const fileSearchContext = createContext<{
    query: string;
    setQuery: (query: string) => void;
} | undefined>(undefined);

export function fileSearchProvider({ children }: { children: ReactNode }) {
    const [query, setQuery] = useState("");

    return (
        <fileSearchContext.Provider value={{ query, setQuery }}>
            {children}
        </fileSearchContext.Provider>
    );
}

export function useFileSearch() {
    const context = useContext(fileSearchContext);

    if(!context) {
        throw new Error("useFileSearch must be used within a FileSearchProvider");
    }

    return context;
}