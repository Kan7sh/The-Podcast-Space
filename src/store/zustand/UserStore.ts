import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/store/zustand/User';

interface UserState {
  user: User | null;
  isAuthenticated: boolean;
  
  // Actions
  setUser: (user: User) => void;
  updateUser: (userData: Partial<User>) => void;
  clearUser: () => void;
  
  // Computed values (getters)
  getUserId: () => string | null;
  getUserName: () => string | null;
  getUserEmail: () => string | null;
  getUserImage: () => string | null | undefined;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,

      setUser: (user: User) => {
        set({ 
          user, 
          isAuthenticated: true 
        });
      },

      updateUser: (userData: Partial<User>) => {
        const currentUser = get().user;
        if (currentUser) {
          const updatedUser = { ...currentUser, ...userData };
          set({ 
            user: updatedUser,
            isAuthenticated: true 
          });
        }
      },

      clearUser: () => {
        set({ 
          user: null, 
          isAuthenticated: false 
        });
      },

      getUserId: () => {
        return get().user?.id || null;
      },

      getUserName: () => {
        return get().user?.name || null;
      },

      getUserEmail: () => {
        return get().user?.email || null;
      },

      getUserImage: () => {
        return get().user?.imageUrl;
      },
    }),
    {
      name: 'user-store', // localStorage key
      partialize: (state) => ({ 
        user: state.user, 
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);