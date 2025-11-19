"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/auth-store";
import { Button } from "@/components/ui/button";

interface Tab {
  id: string;
  label: string;
}

const tabs: Tab[] = [
  { id: "attendance", label: "Посещаемость" },
  { id: "assignments", label: "Задания" },
  { id: "lessons", label: "Уроки" },
  { id: "resources", label: "Ресурсы" },
  { id: "portfolio", label: "Портфолио" },
];

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuthStore();
  const router = useRouter();

  const handleProfileClick = () => {
    setIsOpen(false);
    router.push("/profile");
  };

  const closeSidebar = () => setIsOpen(false);

  return (
    <>
      {/* Hamburger button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden flex flex-col gap-1.5 p-3 rounded-2xl border border-border bg-card/80 backdrop-blur hover:bg-card transition-all shadow-sm"
        aria-label="Toggle menu"
      >
        <span
          className={`h-0.5 w-6 bg-foreground transition-all ${
            isOpen ? "rotate-45 translate-y-2" : ""
          }`}
        ></span>
        <span
          className={`h-0.5 w-6 bg-foreground transition-all ${
            isOpen ? "opacity-0" : ""
          }`}
        ></span>
        <span
          className={`h-0.5 w-6 bg-foreground transition-all ${
            isOpen ? "-rotate-45 -translate-y-2" : ""
          }`}
        ></span>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-30 md:hidden"
            onClick={closeSidebar}
            aria-hidden="true"
          />

          {/* Slide-in sidebar panel */}
          <div className="fixed top-0 left-0 h-screen w-[85%] max-w-sm bg-card border-r border-border z-40 md:hidden animate-in slide-in-from-left duration-300 overflow-y-auto shadow-2xl">
            {/* Close button in top right of sidebar */}
            <div className="flex items-center justify-between p-4 border-b border-border sticky top-0 bg-card z-10">
              <h2 className="text-lg font-semibold text-foreground">Меню</h2>
              <button
                onClick={closeSidebar}
                className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-muted transition-colors text-foreground"
                aria-label="Close menu"
              >
                ✕
              </button>
            </div>

            <div className="p-4 space-y-4">
              {/* Profile section */}
              <div className="space-y-3 pb-4 border-b border-border">
                <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  Профиль
                </p>
                <button
                  onClick={handleProfileClick}
                  className="w-full rounded-2xl bg-linear-to-br from-primary to-accent p-4 text-left text-primary-foreground shadow-lg hover:shadow-xl transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 text-2xl font-semibold">
                      {user?.avatar ?? "🙂"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-base font-semibold truncate">
                        {user?.name}
                      </p>
                      <p className="text-sm opacity-80 truncate">
                        {user?.email}
                      </p>
                    </div>
                    <span className="text-xl font-semibold">→</span>
                  </div>
                  <p className="mt-3 text-xs uppercase tracking-[0.2em] opacity-80">
                    Перейти в профиль
                  </p>
                </button>
              </div>

              {/* Navigation tabs */}
              <div className="space-y-2">
                <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider px-2">
                  Навигация
                </p>
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={closeSidebar}
                    className={`w-full text-left px-4 py-3 rounded-xl font-semibold transition-all ${
                      tab.id === "portfolio"
                        ? "bg-primary text-primary-foreground font-semibold"
                        : "text-foreground hover:bg-muted"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
