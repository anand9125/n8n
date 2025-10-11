import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Field = {
  label: string;
  type: string;
  key?: string;
};

type FormData = {
  fields: Field[];
  setFields: (fields: Field[]) => void;
};


export const userFormStore = create<FormData>((set)=>({
  fields: [],
  setFields: (fields) => set({ fields }),
}))




export const userResponseStore = create<FormData>((set)=>({
  fields: [],
  setFields: (fields) => set({ fields }),
}))


