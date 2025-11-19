'use client';

import { create } from 'zustand';
import { User, AuthState } from './types';
import { persist } from 'zustand/middleware';

interface AuthStore extends AuthState {
  users: User[];
  login: (email: string, password: string) => boolean;
  register: (
    email: string,
    name: string,
    password: string,
    type: "teacher" | "student"
  ) => boolean;
  logout: () => void;
  deleteAccount: () => void;
  updateAvatar: (avatar: string) => void;
}

const DEFAULT_USERS: User[] = [
  {
    id: 'teacher-1',
    email: 'teacher@school.com',
    name: 'Айгүл Нурписова',
    password: 'password123',
    avatar: '👩‍🏫',
    type: 'teacher',
  },
  {
    id: 'student-1',
    email: 'student@school.com',
    name: 'Алия Самигулова',
    password: 'password123',
    avatar: '👩‍🎓',
    type: 'student',
  },
];

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      users: DEFAULT_USERS,

      login: (email: string, password: string) => {
        const user = get().users.find((u) => u.email === email && u.password === password);
        if (user) {
          set({ user, isAuthenticated: true });
          return true;
        }
        return false;
      },

      register: (
        email: string,
        name: string,
        password: string,
        type: "teacher" | "student"
      ) => {
        const existingUser = get().users.find((u) => u.email === email);
        if (existingUser) {
          return false;
        }

        const newUser: User = {
          id: `${type}-${Date.now()}`,
          email,
          name,
          password,
          avatar: type === 'teacher' ? '👩‍🏫' : '👩‍🎓',
          type,
        };

        set((state) => ({
          users: [...state.users, newUser],
          user: newUser,
          isAuthenticated: true,
        }));

        return true;
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
      },

      deleteAccount: () => {
        const currentUser = get().user;
        if (!currentUser) return;

        set((state) => ({
          users: state.users.filter((u) => u.id !== currentUser.id),
          user: null,
          isAuthenticated: false,
        }));
      },

      updateAvatar: (avatar: string) => {
        set((state) => {
          if (state.user) {
            const updatedUser = { ...state.user, avatar };
            return {
              user: updatedUser,
              users: state.users.map((u) => (u.id === updatedUser.id ? updatedUser : u)),
            };
          }
          return state;
        });
      },
    }),
    {
      name: 'auth-store',
    }
  )
);
