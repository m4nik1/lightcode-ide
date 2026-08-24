import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

type ColorMode = 'light' | 'dark'

interface settingsState {
  colorMode: ColorMode;
  setColorMode: (mode: ColorMode) => void;
}

const useSettings = create<settingsState>()(
  persist(
    (set) => ({
      colorMode: 'dark',
      setColorMode: (mode) => {
        set({ colorMode: mode })
        setColorMode(mode)
      }
    }),
    {
      name: 'settings-storage',
      storage: createJSONStorage(() => localStorage)
    }
  )
)

function setColorMode(colorMode : string) {
  console.log("Setting color mode: ", colorMode);
}

export default useSettings;
