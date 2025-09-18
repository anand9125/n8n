
import { create } from "zustand";
import { persist } from "zustand/middleware";

type Field = {
  label: string;
  type: string;
  key?: string;
};

type FormData = {
  fields: Field[];
  setFields: (fields: Field[]) => void;
};

export const userFormStore = create<FormData>()(
  persist(
    (set) => ({
      fields: [],
      setFields: (fields) => set({ fields }),
    }),
    {
      name: "form-store", // localStorage key
    }
  )
);

//Zustand will save fields into localStorage under the key form-store.