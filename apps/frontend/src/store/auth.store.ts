import { create } from "zustand";
import { persist } from "zustand/middleware";
import { UserProfile } from "@sentiment-watchlist/shared-types";
import { api } from "../lib/api";

interface AuthStore {
  token: string | null;
  user: UserProfile | null;
  hydrated: boolean;
  setSession: (token: string | null, user: UserProfile | null) => void;
  logout: () => Promise<void>;
  markHydrated: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      hydrated: false,
      setSession: (token, user) => {
        api.setAuthHeader(token);
        set({ token, user });
      },
      logout: async () => {
        await api.logout();
        api.setAuthHeader(null);
        set({ token: null, user: null });
      },
      markHydrated: () => {
        const token = get().token;
        api.setAuthHeader(token);
        set({ hydrated: true });
      },
    }),
    {
      name: "auth-store",
      onRehydrateStorage: () => (state) => {
        state?.markHydrated();
      },
    }
  )
);

