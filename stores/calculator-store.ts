import { create } from "zustand";

export interface Constant {
  id: string;
  name: string;
  value: string;
  symbol: string;
}

// Built-in constants
const BUILT_IN_CONSTANTS: Constant[] = [
  { id: "pi", name: "Pi", value: "3.14159265359", symbol: "π" },
  { id: "e", name: "Euler's Number", value: "2.71828182846", symbol: "e" },
  { id: "phi", name: "Golden Ratio", value: "1.61803398875", symbol: "φ" },
  {
    id: "sqrt2",
    name: "Square Root of 2",
    value: "1.41421356237",
    symbol: "√2",
  },
  { id: "c", name: "Speed of Light (m/s)", value: "299792458", symbol: "c" },
  { id: "g", name: "Gravity (m/s²)", value: "9.80665", symbol: "g" },
];

interface CalculatorStore {
  // Constants
  builtInConstants: Constant[];
  userConstants: Constant[];
  addConstant: (name: string, value: string, symbol: string) => void;
  removeConstant: (id: string) => void;
  updateConstant: (id: string, updates: Partial<Omit<Constant, "id">>) => void;
  getAllConstants: () => Constant[];

  // Value to insert (when user selects a constant)
  pendingInsert: string | null;
  setPendingInsert: (value: string | null) => void;
  consumePendingInsert: () => string | null;
}

export const useCalculatorStore = create<CalculatorStore>((set, get) => ({
  builtInConstants: BUILT_IN_CONSTANTS,
  userConstants: [],

  addConstant: (name, value, symbol) => {
    const id = `user_${Date.now()}`;
    set((state) => ({
      userConstants: [...state.userConstants, { id, name, value, symbol }],
    }));
  },

  removeConstant: (id) => {
    set((state) => ({
      userConstants: state.userConstants.filter((c) => c.id !== id),
    }));
  },

  updateConstant: (id, updates) => {
    set((state) => ({
      userConstants: state.userConstants.map((c) =>
        c.id === id ? { ...c, ...updates } : c
      ),
    }));
  },

  getAllConstants: () => {
    const state = get();
    return [...state.builtInConstants, ...state.userConstants];
  },

  pendingInsert: null,

  setPendingInsert: (value) => set({ pendingInsert: value }),

  consumePendingInsert: () => {
    const value = get().pendingInsert;
    set({ pendingInsert: null });
    return value;
  },
}));
