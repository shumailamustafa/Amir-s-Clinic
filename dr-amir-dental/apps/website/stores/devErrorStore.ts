import { create } from 'zustand';

export interface DevError {
  id: string;
  timestamp: Date;
  source: 'Firebase' | 'Component' | 'API' | 'Unknown';
  message: string;
  stack?: string;
}

interface DevErrorState {
  errors: DevError[];
  addError: (error: Omit<DevError, 'id' | 'timestamp'>) => void;
  clearErrors: () => void;
}

export const useDevErrorStore = create<DevErrorState>((set) => ({
  errors: [],
  addError: (error) =>
    set((state) => ({
      errors: [
        {
          ...error,
          id: Math.random().toString(36).substring(2, 9),
          timestamp: new Date(),
        },
        ...state.errors,
      ],
    })),
  clearErrors: () => set({ errors: [] }),
}));
