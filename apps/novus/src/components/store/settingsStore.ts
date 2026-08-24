import { create } from 'zustand'

const initialSettings = {
  colorMode: 'dark'
}

interface settingsState {
  colorMode: string;
  setColorMode: () => void;
}

const useSettings = create<settingsState>((set) => ({
  colorMode: 'dark',
  setColorMode: (mode) => {
    set({ mode })
    setColorMode(mode)
  }
}));

function setColorMode(colorMode : string) {
  console.log("Setting color mode: ", colorMode);
}

export default useSettings;
