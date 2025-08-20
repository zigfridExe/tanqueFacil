import { create } from 'zustand';
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

export const useVehicleStore = create<VehicleState>((set) => ({
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
}));
