import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface DeveloperState {
  showCoordinates: boolean;
  toggleShowCoordinates: () => void;
}

export const useDeveloperStore = create<DeveloperState>()(
  persist(
    (set) => ({
      showCoordinates: false,
      toggleShowCoordinates: () => set((state) => ({ showCoordinates: !state.showCoordinates })),
    }),
    {
      name: 'developer-settings-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
