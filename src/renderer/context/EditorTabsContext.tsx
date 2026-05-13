import { createContext, ReactNode, useContext, useState, useEffect } from "react";

const tabContext = createContext(null)


interface editorTabs {
    filename: String,
    filePath: String
    isModified: boolean,
}

function getFileName(filePath: String) {
  return filePath.split(/[\\/]/).pop() ?? filePath;
}

export function EditorTabsProvider({ children } : { children : ReactNode }) {
    const [activeFilePath, setActivePath] = useState('');
    const [tabs, setTabs] = useState<editorTabs[] | []>([]);

    function openFile(filePath : String) {
        setTabs((tabs : editorTabs[]) => {
            const ifOpen = tabs.some((tabs) => tabs.filePath === filePath)

            if(ifOpen) {
                return tabs;
            }

            return [
                ...tabs,
                {
                    fileName: getFileName(filePath),
                    filePath,
                    isModified: false,
                }
            ]
        });
    }

    useEffect(() => {
        console.log("I am currently on: ", activeFilePath);
    }, [activeFilePath])

    return(
        <tabContext.Provider
            value={{
                activeFilePath,
                setActivePath,
                tabs,
                setTabs
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