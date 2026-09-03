import { trpcClient } from "@/utils/trpc";
import type { FileSearchResult } from "@/utils/trpc";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";

const fileSearchContext = createContext<{
    query: string;
    setQuery: (query: string) => void;
    setCurrentProjectPath: (path: string) => void;
    searchResults: FileSearchResult[];
} | undefined>(undefined);

export function FileSearchProvider({ children }: { children: ReactNode }) {
  const [query, setQuery] = useState("");
  const [currentProjectPath, setCurrentProjectPath] = useState<string>('');
  const [searchResults, setSearchResults] = useState<FileSearchResult[]>([]);

  useEffect(() => {
    if (!currentProjectPath.trim()) {
        setSearchResults([]);
        return;
    }

    // Searches the files then sets the results
    trpcClient.fileSearch
    .query({ projectPath: currentProjectPath, searchQuery: query })
    .then((results) => {
      setSearchResults(results ?? []);
    })
    .catch((err) => {
      console.error("file search failed: ", err);
    });
  }, [query]);

  return (
      <fileSearchContext.Provider value={{ query, setQuery, setCurrentProjectPath, searchResults }}>
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
