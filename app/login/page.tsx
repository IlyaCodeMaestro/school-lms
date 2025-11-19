"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/lib/auth-store";
import { useToast } from "@/components/toast-provider";
import Link from "next/link";

const REMEMBER_KEY = "rememberedCredentials";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuthStore();
  const router = useRouter();
  const { addToast } = useToast();

  const isValidEmail = (value: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  const isValidPassword = (value: string) =>
    /^(?=.*[A-Za-z])[A-Za-z0-9!@#$%^&*()_+\-=[\]{};':",.<>/?]{6,}$/.test(value);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem(REMEMBER_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as {
          email?: string;
          password?: string;
        };
        if (parsed.email) setEmail(parsed.email);
        if (parsed.password) setPassword(parsed.password);
        setRememberMe(true);
      } catch {
        window.localStorage.removeItem(REMEMBER_KEY);
      }
    }
  }, []);

  const persistCredentials = () => {
    if (typeof window === "undefined") return;
    if (rememberMe) {
      window.localStorage.setItem(
        REMEMBER_KEY,
        JSON.stringify({ email, password })
      );
    } else {
      window.localStorage.removeItem(REMEMBER_KEY);
    }
  };

  const handleRememberToggle = (checked: boolean) => {
    setRememberMe(checked);
    if (!checked && typeof window !== "undefined") {
      window.localStorage.removeItem(REMEMBER_KEY);
    }
  };

  const handleLogin = async () => {
    setError("");
    setIsLoading(true);

    if (!email.trim() || !password.trim()) {
      setError("Заполните все поля");
      setIsLoading(false);
      return;
    }

    if (!isValidEmail(email)) {
      setError("Введите корректный email");
      setIsLoading(false);
      return;
    }

    if (!isValidPassword(password)) {
      setError(
        "Пароль должен быть не короче 6 символов и содержать латинские буквы"
      );
      setIsLoading(false);
      return;
    }

    setTimeout(() => {
      const success = login(email, password);
      if (success) {
        persistCredentials();
        addToast("Вход выполнен успешно", "success");
        router.push("/");
      } else {
        setError("Неверный email или пароль");
        addToast("Ошибка входа", "error");
      }
      setIsLoading(false);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-primary/10 via-background to-accent/10 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-linear-to-br from-primary to-accent mb-4">
            <span className="text-3xl font-bold text-primary-foreground">
              📚
            </span>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            School LMS
          </h1>
          <p className="text-muted-foreground">
            Система управления портфолио достижений
          </p>
        </div>

        {/* Card */}
        <div className="bg-card border border-border rounded-2xl p-8 shadow-xl">
          <h2 className="text-2xl font-bold text-foreground mb-6">
            Вход в систему
          </h2>

          {error && (
            <div className="mb-4 rounded-lg bg-red-50 dark:bg-red-950/30 p-4 text-sm text-red-700 dark:text-red-400 border border-red-200 dark:border-red-900">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
                placeholder="example@school.com"
                className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Пароль
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                placeholder="••••••••"
                className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => handleRememberToggle(e.target.checked)}
                  className="h-4 w-4 rounded border-border accent-primary"
                />
                Запомнить меня
              </label>
            </div>
          </div>

          <Button
            onClick={handleLogin}
            disabled={isLoading}
            className="w-full mt-6 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-2.5 rounded-lg transition-all relative overflow-hidden group"
          >
            <span className="relative z-10">
              {isLoading ? "Вход..." : "Войти"}
            </span>
            <span className="absolute inset-0 bg-white opacity-0 group-active:opacity-20 transition-opacity" />
          </Button>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Нет аккаунта?{" "}
            <Link
              href="/register"
              className="text-primary hover:underline font-semibold"
            >
              Зарегистрируйтесь
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
