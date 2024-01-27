import { httpClient } from '@/shared/api';
import { create } from 'zustand';

interface Profile {
  id: string;
  name: string;
}
interface AuthState {
  profile: Profile | null;
  isAuth: boolean;
  errors: string | null;
  isLoading: boolean;
}

interface AuthActions {
  login: (login: string, password: string) => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState & AuthActions>((set) => ({
  profile: null,
  isAuth: false,
  errors: null,
  isLoading: false,
  login: async (login: string, password: string) => {
    try {
      set({ isLoading: true });
      const response = await httpClient.auth.login(login, password);
      set({ isAuth: true, profile: response.data });
    } catch (e) {
      set({ isAuth: false, errors: 'Ошибка авторизации' });
    } finally {
      set({ isLoading: false });
    }
  },
  checkAuth: async () => {
    try {
      set({ isLoading: true });
      await httpClient.auth.checkAuth();
      set({ isAuth: true });
    } catch (e) {
      set({ isAuth: false, errors: 'ошибка авторизации' });
    } finally {
      set({ isLoading: false });
    }
  },
}));
