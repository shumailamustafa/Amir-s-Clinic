'use client';

import React, { useState, useEffect } from 'react';
import { User, CalendarDays, DollarSign, MessageSquare, AlertCircle, RefreshCw } from 'lucide-react';
import { Card, Badge, Button } from '@dental/ui';
import { subscribeToAppointments } from '@dental/firebase';
import { subscribeToReviews } from '@dental/firebase';
import { subscribeToMessages } from '@dental/firebase';
import { subscribeToClinicConfig } from '@dental/firebase';
import type { Appointment, Review, Message, ClinicConfig } from '@dental/types';

export default function DashboardOverview() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [config, setConfig] = useState<ClinicConfig | null>(null);

  useEffect(() => {
    // We fetch all appointments, but in a real app might want to query by date range
    const unsubAppts = subscribeToAppointments(data => setAppointments(data));
    const unsubReviews = subscribeToReviews(data => setReviews(data));
    const unsubMessages = subscribeToMessages(data => setMessages(data));
    const unsubConfig = subscribeToClinicConfig(data => setConfig(data));

    return () => {
      unsubAppts();
      unsubReviews();
      unsubMessages();
      unsubConfig();
    };
  }, []);

  const todayStr = new Date().toISOString().split('T')[0];
  const todaysAppointments = appointments.filter(a => a.date === todayStr);
  const pendingPayments = appointments.filter(a => a.paymentStatus === 'screenshot_submitted' || a.paymentStatus === 'pending');
  const unreadMessages = messages.filter(m => m.status === 'unread');
  const pendingReviews = reviews.filter(r => r.status === 'pending');

  const stats = [
    { title: "Today's Appointments", value: todaysAppointments.length.toString(), icon: CalendarDays, color: 'var(--color-primary)' },
    { title: 'Pending Payments', value: pendingPayments.length.toString(), icon: DollarSign, color: 'var(--color-status-pending)' },
    { title: 'Unread Messages', value: unreadMessages.length.toString(), icon: MessageSquare, color: 'var(--color-error)' },
    { title: 'Pending Reviews', value: pendingReviews.length.toString(), icon: AlertCircle, color: 'var(--color-star-gold)' },
  ];
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
          <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
            <RefreshCw className="w-4 h-4 mr-2" /> Refresh
          </Button>
          <div className="flex items-center gap-3 bg-[var(--color-surface)] px-4 py-2 rounded-lg border border-[var(--color-border)]">
            <span className="text-sm font-medium text-[var(--color-text-primary)]">Clinic Status:</span>
            {config?.holidayMode ? (
              <Badge variant="closed" pulse>Emergency Closed</Badge>
            ) : (
              <Badge variant="open" pulse>Active</Badge>
            )}
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
              {todaysAppointments.length === 0 ? (
                <p className="text-sm text-[var(--color-text-secondary)]">No appointments scheduled for today.</p>
              ) : (
                todaysAppointments.slice(0, 5).map((appt, i) => (
                  <div key={appt.id} className="flex items-center justify-between p-4 bg-[var(--color-bg)] rounded-xl border border-[var(--color-border)]">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-12 rounded-lg bg-[var(--color-primary)]/10 flex items-center justify-center text-[var(--color-primary)] font-bold text-sm">
                        {appt.timeSlot}
                      </div>
                      <div>
                        <p className="font-semibold text-[var(--color-text-primary)] text-sm">{appt.patientName}</p>
                        <p className="text-xs text-[var(--color-text-secondary)]">Ref: {appt.referenceNumber}</p>
                      </div>
                    </div>
                    <Badge variant={appt.status === 'confirmed' ? 'success' : appt.paymentStatus === 'screenshot_submitted' ? 'pending' : 'closed'}>
                      {appt.status}
                    </Badge>
                  </div>
                ))
              )}
              {todaysAppointments.length > 5 && (
                <Button variant="ghost" className="w-full mt-2" onClick={() => window.location.href='/dashboard/appointments'}>View All Appointments →</Button>
              )}
            </div>
          </Card>
        </div>

        {/* Right Col: Quick Links / Notifications */}
        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-bold text-[var(--color-text-primary)] mb-4">Recent Activity</h2>
            <div className="space-y-4">
              {pendingPayments.length > 0 && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-[var(--color-status-pending)]/10 shrink-0 flex items-center justify-center">
                    <DollarSign className="w-4 h-4 text-[var(--color-status-pending)]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[var(--color-text-primary)]">Pending Payments</p>
                    <p className="text-xs text-[var(--color-text-secondary)]">{pendingPayments.length} appointments waiting for screenshot verification.</p>
                  </div>
                </div>
              )}
              {unreadMessages.length > 0 && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-[var(--color-error)]/10 shrink-0 flex items-center justify-center">
                    <MessageSquare className="w-4 h-4 text-[var(--color-error)]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[var(--color-text-primary)]">Unread Messages</p>
                    <p className="text-xs text-[var(--color-text-secondary)]">You have {unreadMessages.length} unread patient messages.</p>
                  </div>
                </div>
              )}
              {pendingReviews.length > 0 && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-[var(--color-star-gold)]/10 shrink-0 flex items-center justify-center">
                    <AlertCircle className="w-4 h-4 text-[var(--color-star-gold)]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[var(--color-text-primary)]">Pending Reviews</p>
                    <p className="text-xs text-[var(--color-text-secondary)]">{pendingReviews.length} reviews awaiting your approval.</p>
                  </div>
                </div>
              )}
              {pendingPayments.length === 0 && unreadMessages.length === 0 && pendingReviews.length === 0 && (
                <p className="text-sm text-[var(--color-text-secondary)]">You're all caught up! No recent actionable items.</p>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
