import { create } from 'zustand'

const initialSettings = {
  colorMode: 'dark'
}

interface settingsState {
  colorMode: () => void;
}

const useSettings = create<settingsState>((set) => ({
  colorMode: () => set((state) => setColorMode(state.colorMode)),
}));

function setColorMode(colorMode : string) {
  console.log("Setting color mode: ", colorMode);
}

export default useSettings;