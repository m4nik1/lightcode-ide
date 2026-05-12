# Editor Tabs Context Hook Plan

Use a React Context for the tab and editor state so `App.tsx` does not have to manually pass `activeFilePath`, `setActiveFilePath`, `tabs`, and related callbacks through props.

## Plan

1. Add `src/renderer/context/EditorTabsContext.tsx`.
2. Store `tabs`, `activeFilePath`, and `activeFolderPath` in the provider.
3. Expose a custom hook: `useEditorTabs()`.
4. Wrap the app UI with `<EditorTabsProvider>`.
5. Update `TopBar`, `FileExplorer`, `TopTabs`, and `ModernEditor` to read and write through the hook.

## Context Example

```tsx
import { createContext, useContext, useState, type ReactNode } from "react";
import type { EditorTab } from "../types/EditorTab";

type EditorTabsContextValue = {
  tabs: EditorTab[];
  activeFilePath: string | null;
  activeFolderPath: string | null;
  openFile: (filePath: string) => void;
  openFolder: (folderPath: string) => void;
  selectTab: (filePath: string) => void;
  closeTab: (filePath: string) => void;
};

const EditorTabsContext = createContext<EditorTabsContextValue | null>(null);

function getFileName(filePath: string) {
  return filePath.split(/[\\/]/).pop() ?? filePath;
}

export function EditorTabsProvider({ children }: { children: ReactNode }) {
  const [tabs, setTabs] = useState<EditorTab[]>([]);
  const [activeFilePath, setActiveFilePath] = useState<string | null>(null);
  const [activeFolderPath, setActiveFolderPath] = useState<string | null>(null);

  function openFile(filePath: string) {
    setTabs((currentTabs) => {
      const alreadyOpen = currentTabs.some((tab) => tab.filePath === filePath);

      if (alreadyOpen) {
        return currentTabs;
      }

      return [
        ...currentTabs,
        {
          id: filePath,
          name: getFileName(filePath),
          filePath,
          isModified: false,
        },
      ];
    });

    setActiveFilePath(filePath);
  }

  function openFolder(folderPath: string) {
    setActiveFolderPath(folderPath);
  }

  function selectTab(filePath: string) {
    setActiveFilePath(filePath);
  }

  function closeTab(filePath: string) {
    setTabs((currentTabs) => {
      const nextTabs = currentTabs.filter((tab) => tab.filePath !== filePath);

      if (activeFilePath === filePath) {
        const nextActiveTab = nextTabs[nextTabs.length - 1] ?? null;
        setActiveFilePath(nextActiveTab?.filePath ?? null);
      }

      return nextTabs;
    });
  }

  return (
    <EditorTabsContext.Provider
      value={{
        tabs,
        activeFilePath,
        activeFolderPath,
        openFile,
        openFolder,
        selectTab,
        closeTab,
      }}
    >
      {children}
    </EditorTabsContext.Provider>
  );
}

export function useEditorTabs() {
  const context = useContext(EditorTabsContext);

  if (context == null) {
    throw new Error("useEditorTabs must be used inside EditorTabsProvider");
  }

  return context;
}
```

## App Usage

`App.tsx` can become simpler because the active file and folder paths come from context instead of local app state.

```tsx
import { useRef } from "react";
import { EditorTabsProvider, useEditorTabs } from "./context/EditorTabsContext";

function AppLayout() {
  const { activeFilePath, activeFolderPath } = useEditorTabs();

  return (
    <>
      <TopBar />
      <FileExplorer />
      <TopTabs />
      <ModernEditor
        filePath={activeFilePath}
        folderPath={activeFolderPath}
        editor={editor}
      />
    </>
  );
}

export default function App() {
  return (
    <EditorTabsProvider>
      <AppLayout />
    </EditorTabsProvider>
  );
}
```

## TopBar Usage

`TopBar` no longer needs `onOpenFile` or `onOpenFolder` props.

```tsx
import { useEditorTabs } from "../context/EditorTabsContext";

export default function TopBar() {
  const { openFile, openFolder } = useEditorTabs();

  async function handleOpenFile() {
    const file = await window.electronAPI.openFile();
    const filePath = file.filePaths[0];

    if (!filePath) {
      return;
    }

    openFile(filePath);
  }

  async function handleOpenFolder() {
    const folder = await window.electronAPI.openFolder();
    const folderPath = folder.filePaths[0];

    if (!folderPath) {
      return;
    }

    openFolder(folderPath);
  }

  // Buttons call handleOpenFile and handleOpenFolder.
}
```

## TopTabs Usage

`TopTabs` reads the tab list and active file directly from context.

```tsx
import { useEditorTabs } from "../context/EditorTabsContext";

export default function TopTabs() {
  const { tabs, activeFilePath, selectTab, closeTab } = useEditorTabs();

  return (
    <div style={styles.strip}>
      {tabs.map((tab) => {
        const isActive = tab.filePath === activeFilePath;

        return (
          <div
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => selectTab(tab.filePath)}
          >
            <span>{tab.name}</span>

            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                closeTab(tab.filePath);
              }}
            >
              x
            </button>
          </div>
        );
      })}
    </div>
  );
}
```

## Key Flow

```tsx
openFile(filePath)
```

does two things:

```tsx
creates a tab if needed
sets activeFilePath
```

Then both `TopTabs` and `ModernEditor` react to the same shared context state.

## Component Data Flow

```text
TopBar / FileExplorer
  -> openFile(filePath)
  -> EditorTabsProvider creates or selects tab
  -> activeFilePath changes
  -> TopTabs highlights the active tab
  -> ModernEditor loads the active file
```
