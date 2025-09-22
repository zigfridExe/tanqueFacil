import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface SettingsState {
  notificationsEnabled: boolean;
  darkMode: boolean;
  automaticBackup: boolean;
  clusterRadiusMeters: number; // raio para agrupar abastecimentos no mapa
  toggleNotifications: () => void;
  toggleDarkMode: () => void;
  toggleAutomaticBackup: () => void;
  setClusterRadiusMeters: (value: number) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      notificationsEnabled: true,
      darkMode: false,
      automaticBackup: true,
      clusterRadiusMeters: 500,
      toggleNotifications: () => set((state) => ({ notificationsEnabled: !state.notificationsEnabled })),
      toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
      toggleAutomaticBackup: () => set((state) => ({ automaticBackup: !state.automaticBackup })),
      setClusterRadiusMeters: (value: number) => set(() => ({ clusterRadiusMeters: Math.max(50, Math.min(5000, Math.round(value))) })),
    }),
    {
      name: 'app-settings-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
