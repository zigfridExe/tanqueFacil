import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Veiculo } from '../../types/veiculo';

interface VehicleState {
  vehicles: Veiculo[];
  selectedVehicle: Veiculo | null;
  setVehicles: (vehicles: Veiculo[]) => void;
  selectVehicle: (vehicle: Veiculo | null) => void;
  addVehicle: (vehicle: Veiculo) => void;
  updateVehicle: (vehicle: Veiculo) => void;
  removeVehicle: (vehicleId: number) => void;
}

export const useVehicleStore = create<VehicleState>()(
  persist(
    (set) => ({
      vehicles: [],
      selectedVehicle: null,
      setVehicles: (vehicles) => set({ vehicles }),
      selectVehicle: (vehicle) => set({ selectedVehicle: vehicle }),
      addVehicle: (vehicle) => set((state) => ({ vehicles: [...state.vehicles, vehicle] })),
      updateVehicle: (updatedVehicle) =>
        set((state) => ({
          vehicles: state.vehicles.map((vehicle) =>
            vehicle.id === updatedVehicle.id ? updatedVehicle : vehicle
          ),
        })),
      removeVehicle: (vehicleId) =>
        set((state) => ({
          vehicles: state.vehicles.filter((vehicle) => vehicle.id !== vehicleId),
        })),
    }),
    {
      name: 'vehicle-store',
      storage: createJSONStorage(() => AsyncStorage),
      // Persist both vehicles and selectedVehicle
      partialize: (state) => ({ vehicles: state.vehicles, selectedVehicle: state.selectedVehicle }),
    }
  )
);
