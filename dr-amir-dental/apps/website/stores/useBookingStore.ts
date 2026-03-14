import { create } from 'zustand';

interface BookingState {
  preSelectedService: string | null;
  setPreSelectedService: (serviceId: string | null) => void;
  clearPreSelectedService: () => void;
}

export const useBookingStore = create<BookingState>((set) => ({
  preSelectedService: null,
  setPreSelectedService: (serviceId) => set({ preSelectedService: serviceId }),
  clearPreSelectedService: () => set({ preSelectedService: null }),
}));
