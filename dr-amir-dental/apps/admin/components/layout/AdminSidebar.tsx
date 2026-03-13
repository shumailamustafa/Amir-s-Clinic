'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  CalendarDays,
  ListHeart,
  Store,
  MessageSquare,
  FileText,
  Mail,
  Settings,
} from 'lucide-react';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/clinic-status', label: 'Clinic Status', icon: Store },
  { href: '/dashboard/appointments', label: 'Appointments', icon: CalendarDays },
  { href: '/dashboard/services', label: 'Services', icon: ListHeart },
  { href: '/dashboard/about', label: 'About (Doctor & Clinic)', icon: FileText },
  { href: '/dashboard/reviews', label: 'Reviews', icon: MessageSquare },
  { href: '/dashboard/blog', label: 'Blog', icon: FileText },
  { href: '/dashboard/messages', label: 'Messages', icon: Mail },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 bg-[var(--color-surface)] border-r border-[var(--color-border)] hidden lg:flex flex-col z-40">
      {/* Logo Area */}
      <div className="h-16 flex items-center px-6 border-b border-[var(--color-border)] shrink-0">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[var(--color-primary)] flex items-center justify-center text-white">
            <span className="font-bold text-lg leading-none">A</span>
          </div>
          <span className="font-bold text-[var(--color-text-primary)]">Admin Portal</span>
        </Link>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1 custom-scrollbar">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-[var(--color-primary)] text-white'
                  : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg)] hover:text-[var(--color-text-primary)]'
              }`}
            >
              <item.icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-[var(--color-text-tertiary)]'}`} />
              {item.label}
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
