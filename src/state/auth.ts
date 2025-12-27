import { create } from "zustand";
import { http } from "../api/http";

export type Role = "USER" | "ADMIN";

let hydratePromise: Promise<void> | null = null;

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: Role;
  referralCode?: string | null;
  points?: number;
};

type AuthState = {
  accessToken: string | null;
  user: AuthUser | null;
  bootstrapped: boolean;

  login: (params: { email: string; password: string }) => Promise<void>;
  register: (params: {
    name: string;
    email: string;
    phone?: string;
    password: string;
    confirmPassword: string;
    inviteCode?: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
  hydrate: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  accessToken: null,
  user: null,
  bootstrapped: false,

  async login(params) {
    const res = await http.post("/auth/login", params);
    set({ accessToken: res.data.accessToken, user: res.data.user });
  },

  async register(params) {
    await http.post("/auth/register", params);
  },

  async logout() {
    try {
      await http.post("/auth/logout");
    } finally {
      set({ accessToken: null, user: null });
    }
  },

  async refresh() {
    const res = await http.post("/auth/refresh");
    set({ accessToken: res.data.accessToken, user: res.data.user });
  },

  async hydrate() {
    if (get().bootstrapped) return;

    if (hydratePromise) {
      await hydratePromise;
      return;
    }

    hydratePromise = (async () => {
      try {
        await Promise.race([
          get().refresh(),
          new Promise<void>((_resolve, reject) =>
            setTimeout(() => reject(new Error("Refresh timeout")), 7000)
          )
        ]);
      } catch {
        set({ accessToken: null, user: null });
      } finally {
        set({ bootstrapped: true });
        hydratePromise = null;
      }
    })();

    await hydratePromise;
  }
}));
