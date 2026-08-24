import { createContext, useContext, useState } from "react";

type ViewContextType = {
  view: "chat" | "settings";
  setView: (view: "chat" | "settings") => void;
};


const viewContext = createContext<ViewContextType | undefined>(undefined);

export function ViewProvider({ children }: { children: React.ReactNode }) {
  const [view, setView] = useState<"chat" | "settings">("chat");

  return (
    <viewContext.Provider value={{
        view,
        setView
      }}
    >
      {children}
    </viewContext.Provider>
  );   
}

export function useView() {
  const context = useContext(viewContext);

  if(!context) {
      throw new Error("useView must be used within a viewProvider");
  }

  return context
}