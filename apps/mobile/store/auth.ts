import { create } from "zustand";
import { api } from "../lib/api";
import { setToken, clearToken, getToken } from "../lib/secure";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "CASHIER";
}

interface AuthState {
  user: AuthUser | null;
  initializing: boolean;
  /** يستعيد الجلسة عند الإقلاع: إن وُجد توكن صالح، يجلب بيانات المستخدم. */
  restore: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: AuthUser | null) => void;
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  initializing: true,

  restore: async () => {
    try {
      const token = await getToken();
      if (!token) {
        set({ user: null, initializing: false });
        return;
      }
      // التوكن موجود — نتحقق منه بجلب /me (يرفض الخادم التوكن المنتهي/المستخدم المحذوف)
      const me = await api.get<AuthUser>("/me");
      set({ user: me, initializing: false });
    } catch {
      await clearToken();
      set({ user: null, initializing: false });
    }
  },

  login: async (email, password) => {
    const res = await api.post<{ token: string; user: AuthUser }>("/auth/token", {
      email,
      password,
    });
    await setToken(res.token);
    set({ user: res.user });
  },

  logout: async () => {
    await clearToken();
    set({ user: null });
  },

  setUser: (user) => set({ user }),
}));
