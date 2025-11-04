import { create } from "zustand";

export const useAuthStore =create((set) => ({
    authUser: {name: "john", _id: 123 }
}))