import { createContext, ReactNode, useContext, useState } from "react";

const tabContext = createContext(null)


export function EditorTabsProvider({ children } : { children : ReactNode }) {
    const [activeFilePath, setActivePath] = useState('');

    return(
        <tabContext.Provider
            value={{
                activeFilePath
            }}
        >
            {children}
        </tabContext.Provider>
    )
}

export function useEditorTabs() {
    const context = useContext(tabContext);

    return context;
}