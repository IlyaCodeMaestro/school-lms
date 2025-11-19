'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/lib/auth-store';
import { useToast } from '@/components/toast-provider';
import Link from 'next/link';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userType, setUserType] = useState<'teacher' | 'student'>('teacher');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuthStore();
  const router = useRouter();
  const { addToast } = useToast();

  const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  const isValidPassword = (value: string) => /^(?=.*[A-Za-z])[A-Za-z0-9!@#$%^&*()_+\-=[\]{};':",.<>/?]{6,}$/.test(value);

  const handleRegister = async () => {
    setError('');

    if (!email.trim() || !name.trim() || !password.trim() || !confirmPassword.trim()) {
      setError('Заполните все поля');
      return;
    }

    if (!isValidEmail(email)) {
      setError('Введите корректный email');
      return;
    }

    if (!isValidPassword(password)) {
      setError('Пароль должен быть не короче 6 символов и содержать латинские буквы');
      return;
    }

    if (password !== confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const success = register(email, name, password, userType);
      if (success) {
        addToast('Регистрация выполнена успешно', 'success');
        router.push('/login');
      } else {
        setError('Пользователь с таким email уже существует');
        addToast('Ошибка регистрации', 'error');
      }
      setIsLoading(false);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/10 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent mb-4">
            <span className="text-3xl font-bold text-primary-foreground">📚</span>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">School LMS</h1>
          <p className="text-muted-foreground">Создайте новый аккаунт</p>
        </div>

        {/* Card */}
        <div className="bg-card border border-border rounded-2xl p-8 shadow-xl">
          <h2 className="text-2xl font-bold text-foreground mb-6">Регистрация</h2>

          {error && (
            <div className="mb-4 rounded-lg bg-red-50 dark:bg-red-950/30 p-4 text-sm text-red-700 dark:text-red-400 border border-red-200 dark:border-red-900">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError('');
                }}
                placeholder="example@school.com"
                className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Имя</label>
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setError('');
                }}
                placeholder="Ваше имя"
                className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Тип аккаунта</label>
              <div className="flex gap-3">
                <button
                  onClick={() => setUserType('teacher')}
                  className={`flex-1 rounded-lg border-2 px-4 py-2.5 font-semibold transition-all ${
                    userType === 'teacher'
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border text-foreground hover:border-primary/50'
                  }`}
                >
                  👩‍🏫 Учитель
                </button>
                <button
                  onClick={() => setUserType('student')}
                  className={`flex-1 rounded-lg border-2 px-4 py-2.5 font-semibold transition-all ${
                    userType === 'student'
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border text-foreground hover:border-primary/50'
                  }`}
                >
                  👩‍🎓 Ученик
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Пароль</label>
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                placeholder="••••••••"
                className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Повторите пароль</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setError('');
                }}
                placeholder="••••••••"
                className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              />
            </div>
          </div>

          <Button
            onClick={handleRegister}
            disabled={isLoading}
            className="w-full mt-6 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-2.5 rounded-lg transition-all relative overflow-hidden group"
          >
            <span className="relative z-10">{isLoading ? 'Создание...' : 'Зарегистрироваться'}</span>
            <span className="absolute inset-0 bg-white opacity-0 group-active:opacity-20 transition-opacity" />
          </Button>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Уже есть аккаунт?{' '}
            <Link href="/login" className="text-primary hover:underline font-semibold">
              Войти
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
