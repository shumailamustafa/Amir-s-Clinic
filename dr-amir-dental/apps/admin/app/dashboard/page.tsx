'use client';

import React from 'react';
import { User, CalendarDays, DollarSign, MessageSquare, AlertCircle, RefreshCw } from 'lucide-react';
import { Card, Badge, Button } from '@dental/ui';

// Placeholder stats — will be replaced with real Firestore queries
const stats = [
  { title: "Today's Appointments", value: '8', icon: CalendarDays, color: 'var(--color-primary)' },
  { title: 'Pending Payments', value: '3', icon: DollarSign, color: 'var(--color-status-pending)' },
  { title: 'Unread Messages', value: '5', icon: MessageSquare, color: 'var(--color-error)' },
  { title: 'Pending Reviews', value: '2', icon: AlertCircle, color: 'var(--color-star-gold)' },
];

export default function DashboardOverview() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Dashboard Overview</h1>
          <p className="text-sm text-[var(--color-text-secondary)]">
            Welcome back, Dr. Amir. Here's what's happening today.
          </p>
        </div>
        
        {/* Quick Actions */}
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" /> Refresh
          </Button>
          <div className="flex items-center gap-3 bg-[var(--color-surface)] px-4 py-2 rounded-lg border border-[var(--color-border)]">
            <span className="text-sm font-medium text-[var(--color-text-primary)]">Clinic Status:</span>
            <Badge variant="open" pulse>Open Now</Badge>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat) => (
          <Card key={stat.title} className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center bg-opacity-10 backdrop-blur-sm"
                style={{ backgroundColor: `${stat.color}15` }}
              >
                <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
              </div>
            </div>
            <div>
              <p className="text-3xl font-bold text-[var(--color-text-primary)]">{stat.value}</p>
              <p className="text-sm font-medium text-[var(--color-text-secondary)] mt-1">{stat.title}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Col: Upcoming Appointments (simulated) */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-bold text-[var(--color-text-primary)] mb-4">Upcoming Appointments (Today)</h2>
            <div className="space-y-4">
              {[1, 2, 3].map((_, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-[var(--color-bg)] rounded-xl border border-[var(--color-border)]">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-[var(--color-primary)]/10 flex items-center justify-center text-[var(--color-primary)] font-bold">
                      {10 + i}:00
                    </div>
                    <div>
                      <p className="font-semibold text-[var(--color-text-primary)] text-sm">Patient Name {i+1}</p>
                      <p className="text-xs text-[var(--color-text-secondary)]">Root Canal Treatment</p>
                    </div>
                  </div>
                  <Badge variant={i === 0 ? 'success' : 'pending'}>
                    {i === 0 ? 'Confirmed' : 'Pending Payment'}
                  </Badge>
                </div>
              ))}
              <Button variant="ghost" className="w-full mt-2">View All Appointments →</Button>
            </div>
          </Card>
        </div>

        {/* Right Col: Quick Links / Notifications */}
        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-bold text-[var(--color-text-primary)] mb-4">Recent Activity</h2>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-[var(--color-success)]/10 shrink-0 flex items-center justify-center">
                  <DollarSign className="w-4 h-4 text-[var(--color-success)]" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[var(--color-text-primary)]">Payment Verified</p>
                  <p className="text-xs text-[var(--color-text-secondary)]">Ahmed Khan — 10 mins ago</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-[var(--color-star-gold)]/10 shrink-0 flex items-center justify-center">
                  <AlertCircle className="w-4 h-4 text-[var(--color-star-gold)]" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[var(--color-text-primary)]">New Review Pending</p>
                  <p className="text-xs text-[var(--color-text-secondary)]">Sana Malik — 1 hr ago</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
