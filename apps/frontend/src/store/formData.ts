import {create} from "zustand";
type Field = {
    label: string;
    type: string;
    key?: string;
}

type FormData = {
    fields: Field[];
    setFields: (fields: Field[]) => void;
}

export const userFormStore = create<FormData>((set) => ({
    fields:[],
    setFields:(fields:Field[])=>{
        set({fields})
    }

}))