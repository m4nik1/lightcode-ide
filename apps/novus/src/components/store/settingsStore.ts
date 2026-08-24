import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

const initialSettings = {
  colorMode: 'dark'
}

interface settingsState {
  colorMode: string;
  setColorMode: () => void;
}

const useSettings = create<settingsState>()(
  persist(
    (set, get) => ({
      colorMode: 'dark',
      setColorMode: (mode) => {
        set({ mode })
        setColorMode(mode)
      }
    }),
    {
      name: 'settings-storage',
      storage: createJSONStorage(() => sessionStorage)
    }
  )
)

function setColorMode(colorMode : string) {
  console.log("Setting color mode: ", colorMode);
}

export default useSettings;
