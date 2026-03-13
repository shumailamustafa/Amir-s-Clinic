'use client';

import React, { useState } from 'react';
import { Mail, Phone, Calendar, Search, Reply, Archive } from 'lucide-react';
import { Button, Card, Badge } from '@dental/ui';

const MOCK_MESSAGES = [
  { id: '1', name: 'Zohaib Tariq', email: 'zohaib@example.com', phone: '0300-1111111', date: '2024-03-12 14:30', subject: 'Inquiry about Braces', message: 'Hello, I want to know the estimated cost for ceramic braces and how long the treatment usually takes.', status: 'unread' },
  { id: '2', name: 'Sarah Khan', email: 'sarah.k@example.com', phone: '0300-2222222', date: '2024-03-11 09:15', subject: 'Emergency Appointment', message: 'I have severe tooth pain since last night. Is it possible to see the doctor today?', status: 'read' },
  { id: '3', name: 'Usman Ali', email: 'usman.a@example.com', phone: '0300-3333333', date: '2024-03-10 16:45', subject: 'Clinic Location', message: 'Can you please share your exact location on WhatsApp?', status: 'replied' },
];

export default function MessagesPage() {
  const [selectedMsg, setSelectedMsg] = useState<any>(MOCK_MESSAGES[0]);

  return (
    <div className="space-y-6 h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex justify-between items-center shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Inbox</h1>
          <p className="text-[var(--color-text-secondary)]">Manage messages from the website contact form.</p>
        </div>
        <div className="relative w-64">
          <Search className="w-4 h-4 text-[var(--color-text-secondary)] absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Search messages..."
            className="w-full pl-9 pr-4 py-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          />
        </div>
      </div>

      <div className="flex-1 flex gap-6 overflow-hidden">
        {/* List Pane */}
        <Card className="w-1/3 flex flex-col overflow-hidden border-r border-[var(--color-border)]">
          <div className="p-3 border-b border-[var(--color-border)] flex gap-2 shrink-0 overflow-x-auto custom-scrollbar">
             <Badge variant="open" className="cursor-pointer">Unread (1)</Badge>
             <Badge variant="closed" className="cursor-pointer opacity-70">All Messages</Badge>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar divide-y divide-[var(--color-border)]">
            {MOCK_MESSAGES.map(msg => (
              <div 
                key={msg.id}
                onClick={() => setSelectedMsg(msg)}
                className={`p-4 cursor-pointer transition-colors ${
                  selectedMsg?.id === msg.id ? 'bg-[var(--color-primary)]/10 border-l-4 border-[var(--color-primary)]' : 'hover:bg-[var(--color-surface)] border-l-4 border-transparent'
                }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <p className={`font-medium ${msg.status === 'unread' ? 'text-[var(--color-text-primary)] font-bold' : 'text-[var(--color-text-secondary)]'}`}>
                    {msg.name}
                  </p>
                  <p className="text-[10px] text-[var(--color-text-tertiary)]">{msg.date.split(' ')[0]}</p>
                </div>
                <p className="text-sm font-medium text-[var(--color-text-primary)] truncate mb-1">{msg.subject}</p>
                <p className="text-xs text-[var(--color-text-secondary)] line-clamp-2">{msg.message}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Detail Pane */}
        {selectedMsg ? (
          <Card className="w-2/3 flex flex-col overflow-hidden">
            {/* Toolbar */}
            <div className="h-14 border-b border-[var(--color-border)] px-6 flex items-center justify-between shrink-0 bg-[var(--color-surface)]">
              <div className="flex items-center gap-2">
                <Badge variant={
                  selectedMsg.status === 'unread' ? 'open' : 
                  selectedMsg.status === 'replied' ? 'success' : 'closed'
                }>
                  {selectedMsg.status.toUpperCase()}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => {}} title="Mark as Replied">
                  <Reply className="w-4 h-4 mr-2" /> Mark Replied
                </Button>
                <Button variant="ghost" size="sm" className="text-[var(--color-text-secondary)] hover:text-red-500 hover:bg-red-50/10">
                  <Archive className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Header Info */}
            <div className="p-6 border-b border-[var(--color-border)] bg-[var(--color-bg)] shrink-0">
              <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-4">{selectedMsg.subject}</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center text-[var(--color-primary)] font-bold">
                    {selectedMsg.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-[var(--color-text-primary)]">{selectedMsg.name}</p>
                    <p className="text-xs text-[var(--color-text-secondary)] flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> {selectedMsg.date}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col justify-center gap-1 text-sm text-[var(--color-text-secondary)] items-end">
                  <p className="flex items-center gap-2"><Mail className="w-3 h-3"/> {selectedMsg.email}</p>
                  <p className="flex items-center gap-2"><Phone className="w-3 h-3"/> {selectedMsg.phone}</p>
                </div>
              </div>
            </div>

            {/* Message Body */}
            <div className="flex-1 p-6 overflow-y-auto custom-scrollbar bg-[var(--color-surface)]">
              <p className="text-[var(--color-text-primary)] whitespace-pre-wrap leading-relaxed">
                {selectedMsg.message}
              </p>
            </div>
            
            {/* Quick Reply Box (simulated UI) */}
            <div className="p-4 border-t border-[var(--color-border)] bg-[var(--color-bg)] shrink-0">
               <textarea 
                  className="w-full text-sm bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg px-4 py-3 text-[var(--color-text-primary)] focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-none resize-none"
                  placeholder="Click here to reply via email integration (or use WhatsApp on mobile)..."
                  rows={2}
               />
               <div className="mt-2 flex justify-end">
                  <Button size="sm"><Mail className="w-4 h-4 mr-2"/> Send Email Reply</Button>
               </div>
            </div>
          </Card>
        ) : (
          <div className="w-2/3 flex items-center justify-center text-[var(--color-text-secondary)] border border-dashed border-[var(--color-border)] rounded-2xl">
            Select a message to read
          </div>
        )}
      </div>
    </div>
  );
}
