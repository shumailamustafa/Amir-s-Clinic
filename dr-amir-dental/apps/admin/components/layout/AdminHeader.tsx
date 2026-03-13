'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, Menu } from 'lucide-react';
import { ThemeToggle } from '../ui/ThemeToggle'; // Using the shared toggle we'll pass if needed, or import from common if we moved it. Wait, we built ThemeToggle in website. Let's build a quick one here.

// Simple Theme Toggle for Admin
import { useTheme } from '../providers/ThemeProvider';
import { Sun, Moon } from 'lucide-react';
import { Button } from '@dental/ui';

function AdminThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg text-[var(--color-text-secondary)] hover:bg-[var(--color-surface)] transition-colors cursor-pointer"
      aria-label="Toggle theme"
    >
      {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
    </button>
  );
}

export function AdminHeader() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
      router.refresh();
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-[var(--color-bg)]/80 backdrop-blur-md border-b border-[var(--color-border)] flex items-center justify-between px-4 sm:px-6 lg:px-8">
      {/* Mobile Menu Button - will implement full mobile sidebar later if needed */}
      <div className="flex items-center lg:hidden">
        <button className="p-2 -ml-2 rounded-lg text-[var(--color-text-secondary)] hover:bg-[var(--color-surface)]">
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* spacer for desktop */}
      <div className="hidden lg:block flex-1" />

      {/* Right Side */}
      <div className="flex items-center gap-4">
        <AdminThemeToggle />
        
        <div className="h-6 w-px bg-[var(--color-border)]" />
        
        <div className="flex items-center gap-3">
          <div className="hidden sm:block text-right">
            <p className="text-sm font-medium text-[var(--color-text-primary)]">Dr. Amir</p>
            <p className="text-xs text-[var(--color-text-secondary)]">Administrator</p>
          </div>
          <div className="w-8 h-8 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center justify-center text-[var(--color-primary)]">
            👨‍⚕️
          </div>
        </div>

        <Button variant="ghost" size="sm" onClick={handleLogout} className="text-red-500 hover:text-red-600 hover:bg-red-500/10 hidden sm:flex">
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>
    </header>
  );
}
