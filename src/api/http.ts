import axios from "axios";
import { env } from "../env";
import { useAuthStore } from "../state/auth";

export const http = axios.create({
  baseURL: `${env.API_BASE_URL}/api`,
  withCredentials: true
});

http.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let isRefreshing = false;
let queued: Array<{ resolve: () => void; reject: (error: unknown) => void }> = [];

function isAuthRefreshRequest(url?: string) {
  return typeof url === "string" && url.includes("/auth/refresh");
}

http.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (isAuthRefreshRequest(original?.url)) {
      throw error;
    }

    if (error.response?.status !== 401 || original?._retry) {
      throw error;
    }

    original._retry = true;

    if (isRefreshing) {
      await new Promise<void>((resolve, reject) => queued.push({ resolve, reject }));
      return http(original);
    }

    isRefreshing = true;

    try {
      await useAuthStore.getState().refresh();
      queued.forEach((q) => q.resolve());
      queued = [];
      return http(original);
    } catch (e) {
      queued.forEach((q) => q.reject(e));
      queued = [];
      throw error;
    } finally {
      isRefreshing = false;
    }
  }
);
