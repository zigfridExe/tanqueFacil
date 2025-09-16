import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface SettingsState {
  notificationsEnabled: boolean;
  darkMode: boolean;
  automaticBackup: boolean;
  toggleNotifications: () => void;
  toggleDarkMode: () => void;
  toggleAutomaticBackup: () => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      notificationsEnabled: true,
      darkMode: false,
      automaticBackup: true,
      toggleNotifications: () => set((state) => ({ notificationsEnabled: !state.notificationsEnabled })),
      toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
      toggleAutomaticBackup: () => set((state) => ({ automaticBackup: !state.automaticBackup })),
    }),
    {
      name: 'app-settings-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
