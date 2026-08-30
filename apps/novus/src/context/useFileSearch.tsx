import { trpcClient } from "@/utils/trpc";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";

const fileSearchContext = createContext<{
    query: string;
    setQuery: (query: string) => void;
    setCurrentProjectPath: (path: string) => void;
} | undefined>(undefined);

export function fileSearchProvider({ children }: { children: ReactNode }) {
    const [query, setQuery] = useState("");
    const [currentProjectPath, setCurrentProjectPath] = useState<string>('');

    useEffect(() => {
        console.log("query changed: ", query);
        trpcClient.fileSearch.query({ projectPath: currentProjectPath, searchQuery: query });
    }, [query]);

    return (
        <fileSearchContext.Provider value={{ query, setQuery, setCurrentProjectPath }}>
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