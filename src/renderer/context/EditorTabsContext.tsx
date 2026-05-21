import { createContext, ReactNode, useContext, useState, useEffect, React } from "react";
import { EditorTab } from "../types/EditorTab";

type EditorTabsContext = {
  activeFilePath: string,
  setActivePath: React.Dispatch<React.SetStateAction<string>>,
  tabs: EditorTab[],
  setTabs: React.Dispatch<React.SetStateAction<EditorTab[]>>,
  openFile: (filePath: string) => void;
  activeFolder: string
  openFolder: () => void;
}

const tabContext = createContext<EditorTabsContext | undefined>(undefined)


function getFileName(filePath: string) {
  return filePath.split(/[\\/]/).pop() ?? filePath;
}

export function EditorTabsProvider({ children }: { children: ReactNode }) {
  const [activeFilePath, setActivePath] = useState('');
  const [tabs, setTabs] = useState<EditorTab[] | []>([]);
  const [activeFolder, setFolder] = useState('');

  let nextTabID: number = tabs.length;


  // Opens file and adds to the tabs
  function openFile(filePath: string) {
    setActivePath(filePath);

    setTabs((tabs: EditorTab[]) => {
      const ifOpen = tabs.some((tabs) => tabs.filePath === filePath)

      if (ifOpen) {
        return tabs;
      }

      nextTabID += 1;

      return [
        ...tabs,
        {
          id: nextTabID,
          filename: getFileName(filePath),
          filePath,
          isModified: false,
        }
      ]
    });
  }

  async function openFolder() {
    const folder = await window.electronAPI.openFolder()
    const folderPath = folder.filePaths[0]

    if (!folderPath) {
      return
    }

    setFolder(folderPath);
  }

  useEffect(() => {
    console.log("I am currently on: ", activeFilePath);
  }, [activeFilePath])

  return (
    <tabContext.Provider
      value={{
        activeFilePath,
        setActivePath,
        tabs,
        setTabs,
        openFile,
        openFolder,
        activeFolder
      }}
    >
      {children}
    </tabContext.Provider>
  )
}

export function useEditorTabs() {
  const context = useContext(tabContext);

  if (!context) {
    throw new Error("useEditorTabs must be used within an EditorTabsProvider");
  }

  return context;
}
