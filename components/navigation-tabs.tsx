'use client';

import { ProfileMenu } from '@/components/profile-menu';
import { MobileMenu } from '@/components/mobile-menu';

interface Tab {
  id: string;
  label: string;
  active: boolean;
}

const tabs: Tab[] = [
  { id: 'attendance', label: 'Посещаемость', active: false },
  { id: 'assignments', label: 'Задания', active: false },
  { id: 'lessons', label: 'Уроки', active: false },
  { id: 'resources', label: 'Ресурсы', active: false },
  { id: 'portfolio', label: 'Портфолио', active: true },
];

export function NavigationTabs() {
  return (
    <div className="border-b border-border bg-card sticky top-0 z-40">
      <div className="mx-auto flex max-w-7xl items-center px-4 md:px-6 py-2">
        {/* Mobile menu */}
        <div className="flex items-center md:hidden">
          <MobileMenu />
        </div>

        {/* Desktop tabs */}
        <div className="hidden md:flex overflow-x-auto scrollbar-hide flex-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`flex-shrink-0 border-b-2 px-6 py-4 font-medium transition-all duration-200 ${
                tab.active
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Desktop profile */}
        <div className="hidden md:flex flex-shrink-0">
          <ProfileMenu />
        </div>
      </div>
    </div>
  );
}
