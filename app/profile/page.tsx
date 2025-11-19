"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/auth-store";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

export default function ProfilePage() {
  const { user, isAuthenticated, logout, deleteAccount, updateAvatar } =
    useAuthStore();
  const router = useRouter();
  const [selectedAvatar, setSelectedAvatar] = useState(user?.avatar || "👩‍🏫");

  const avatarOptions = ["👩‍🏫", "👨‍🏫", "👩‍🎓", "👨‍🎓", "😊", "🤓", "😎", "🙂"];

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  if (!user || !isAuthenticated) {
    return null;
  }

  const handleAvatarChange = (avatar: string) => {
    setSelectedAvatar(avatar);
    updateAvatar(avatar);
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const handleDeleteAccount = () => {
    deleteAccount();
    router.push("/login");
  };

  const maskPassword = (password: string) => "*".repeat(password.length);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card sticky top-0 z-40">
        <div className="mx-auto max-w-4xl px-4 md:px-6 py-4 flex items-center justify-center relative">
          <button
            onClick={() => router.back()}
            className="flex items-center justify-center w-10 h-10 rounded-lg hover:bg-muted transition-colors text-foreground hover:text-primary absolute left-4 md:left-6"
            aria-label="Go back"
          >
            ←
          </button>

          <h1 className="text-2xl font-bold text-foreground text-center">
            Профиль
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-4xl px-4 md:px-6 py-8">
        <div className="space-y-8">
          {/* Avatar Section */}
          <div className="bg-card border border-border rounded-lg p-6 space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Аватар</h2>
            <div className="flex items-center gap-6">
              <div className="flex items-center justify-center w-24 h-24 rounded-full bg-linear-to-br from-primary to-accent text-5xl">
                {selectedAvatar}
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-4">
                  Выберите новый аватар:
                </p>
                <div className="grid grid-cols-4 gap-2">
                  {avatarOptions.map((avatar) => (
                    <button
                      key={avatar}
                      onClick={() => handleAvatarChange(avatar)}
                      className={`w-14 h-14 rounded-lg flex items-center justify-center text-3xl transition-all hover:scale-110 ${
                        selectedAvatar === avatar
                          ? "ring-2 ring-primary bg-muted/50"
                          : "bg-muted/30 hover:bg-muted/50"
                      } relative overflow-hidden group`}
                    >
                      <span className="relative z-10">{avatar}</span>
                      <span className="absolute inset-0 bg-white opacity-0 group-active:opacity-10 transition-opacity" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* User Information */}
          <div className="bg-card border border-border rounded-lg p-6 space-y-4">
            <h2 className="text-lg font-semibold text-foreground">
              Информация об учётной записи
            </h2>

            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Имя
              </label>
              <p className="text-foreground mt-1 px-3 py-2 bg-muted/30 rounded-lg">
                {user.name}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Email
              </label>
              <p className="text-foreground mt-1 px-3 py-2 bg-muted/30 rounded-lg">
                {user.email}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Тип учётной записи
              </label>
              <p className="text-foreground mt-1 px-3 py-2 bg-muted/30 rounded-lg">
                {user.type === "teacher" ? "Учитель" : "Ученик"}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Пароль
              </label>
              <p className="text-foreground mt-1 px-3 py-2 bg-muted/30 rounded-lg">
                {maskPassword(user.password)}
              </p>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-card border border-red-200 dark:border-red-900 rounded-lg p-6 space-y-4">
            <div>
              <h2 className="text-lg font-semibold text-red-600 dark:text-red-400">
                Опасная зона
              </h2>
              <p className="text-sm text-muted-foreground mt-2">
                Эти действия невозможно отменить. Пожалуйста, убедитесь в своём
                решении.
              </p>
            </div>

            <div className="space-y-3">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-lg transition-all relative overflow-hidden group">
                    <span className="relative z-10">Выйти из аккаунта</span>
                    <span className="absolute inset-0 bg-white opacity-0 group-active:opacity-20 transition-opacity" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Вы уверены, что хотите выйти?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Вы будете перенаправлены на страницу входа и сможете
                      вернуться позже.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Отмена</AlertDialogCancel>
                    <AlertDialogAction onClick={handleLogout}>
                      Выйти
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="destructive"
                    className="w-full font-semibold py-3 rounded-lg transition-all relative overflow-hidden group"
                  >
                    <span className="relative z-10">Удалить аккаунт</span>
                    <span className="absolute inset-0 bg-white opacity-0 group-active:opacity-20 transition-opacity" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Удалить аккаунт навсегда?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Все данные профиля будут удалены без возможности
                      восстановления. Вы уверены, что хотите продолжить?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Отмена</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDeleteAccount}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Удалить
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
