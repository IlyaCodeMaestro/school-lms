'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/lib/auth-store';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/toast-provider';

export function ProfileMenu() {
  const { user, logout, updateAvatar } = useAuthStore();
  const router = useRouter();
  const { addToast } = useToast();
  const [showMenu, setShowMenu] = useState(false);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);

  const avatarOptions = ['👩‍🏫', '👨‍🏫', '👩‍🎓', '👨‍🎓', '😊', '🤓', '😎', '🙂'];

  const handleLogout = () => {
    logout();
    addToast('Вы вышли из аккаунта', 'success');
    setShowMenu(false);
    setTimeout(() => {
      router.push('/login');
    }, 100);
  };

  const handleAvatarChange = (avatar: string) => {
    updateAvatar(avatar);
    setShowAvatarPicker(false);
    addToast('Аватар изменен', 'success');
  };

  if (!user) return null;

  return (
    <div className="relative">
      <button
        onClick={() => router.push('/profile')}
        className="flex items-center justify-center w-10 h-10 rounded-full bg-linear-to-br from-primary to-accent text-lg font-bold text-primary-foreground hover:shadow-lg transition-all hover:scale-110 relative overflow-hidden group"
        title="Профиль"
      >
        <span className="relative z-10">{user.avatar}</span>
        <span className="absolute inset-0 bg-white opacity-0 group-active:opacity-20 transition-opacity" />
      </button>
    </div>
  );
}
