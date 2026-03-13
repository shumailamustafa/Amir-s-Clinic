'use client';

import React, { useState, useEffect } from 'react';
import { Mail, Phone, Calendar, Search, Reply, Archive } from 'lucide-react';
import { Button, Card, Badge } from '@dental/ui';
import { subscribeToMessages, updateMessageStatus } from '@dental/firebase';
import type { Message } from '@dental/types';

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedMsg, setSelectedMsg] = useState<Message | null>(null);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const unsub = subscribeToMessages((data) => {
      setMessages(data);
      if (!selectedMsg && data.length > 0) {
        setSelectedMsg(data[0]);
      }
    });
    return unsub;
  }, []);

  const handleUpdateStatus = async (id: string, status: 'replied' | 'read') => {
    try {
      await updateMessageStatus(id, status);
      if (selectedMsg?.id === id) {
         setSelectedMsg({ ...selectedMsg, status });
      }
    } catch (e) {
      console.error('Failed to update message status', e);
    }
  };

  const filteredMessages = messages.filter(msg => {
    if (filter === 'unread' && msg.status !== 'unread') return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return msg.name.toLowerCase().includes(q) || 
             (msg as any).subject?.toLowerCase().includes(q) || 
             msg.email.toLowerCase().includes(q);
    }
    return true;
  });

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
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          />
        </div>
      </div>

      <div className="flex-1 flex gap-6 overflow-hidden">
        {/* List Pane */}
        <Card className="w-1/3 flex flex-col overflow-hidden border-r border-[var(--color-border)]">
          <div className="p-3 border-b border-[var(--color-border)] flex gap-2 shrink-0 overflow-x-auto custom-scrollbar">
             <button onClick={() => setFilter('unread')} className="focus:outline-none">
               <Badge variant={filter === 'unread' ? 'open' : 'closed'} className="cursor-pointer">
                 Unread ({messages.filter(m => m.status === 'unread').length})
               </Badge>
             </button>
             <button onClick={() => setFilter('all')} className="focus:outline-none">
               <Badge variant={filter === 'all' ? 'open' : 'closed'} className={`cursor-pointer ${filter === 'all' ? '' : 'opacity-70'}`}>
                 All Messages ({messages.length})
               </Badge>
             </button>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar divide-y divide-[var(--color-border)]">
            {filteredMessages.map(msg => (
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
                  <p className="text-[10px] text-[var(--color-text-tertiary)]">{new Date(msg.createdAt).toLocaleDateString()}</p>
                </div>
                <p className="text-sm font-medium text-[var(--color-text-primary)] truncate mb-1">{(msg as any).subject || 'Website Inquiry'}</p>
                <p className="text-xs text-[var(--color-text-secondary)] line-clamp-2">{msg.message}</p>
              </div>
            ))}
            {filteredMessages.length === 0 && (
              <div className="p-8 text-center text-sm text-[var(--color-text-secondary)]">
                No messages found.
              </div>
            )}
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
                <Button variant="ghost" size="sm" onClick={() => handleUpdateStatus(selectedMsg.id, 'replied')} title="Mark as Replied">
                  <Reply className="w-4 h-4 mr-2" /> Mark Replied
                </Button>
                <Button variant="ghost" size="sm" className="text-[var(--color-text-secondary)] hover:text-red-500 hover:bg-red-50/10" onClick={() => handleUpdateStatus(selectedMsg.id, 'read')} title="Mark as Read">
                  <Archive className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Header Info */}
            <div className="p-6 border-b border-[var(--color-border)] bg-[var(--color-bg)] shrink-0">
              <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-4">{(selectedMsg as any).subject || 'Website Inquiry'}</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center text-[var(--color-primary)] font-bold uppercase">
                    {selectedMsg.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-[var(--color-text-primary)]">{selectedMsg.name}</p>
                    <p className="text-xs text-[var(--color-text-secondary)] flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> {new Date(selectedMsg.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col justify-center gap-1 text-sm text-[var(--color-text-secondary)] items-end">
                  <p className="flex items-center gap-2">
                    <Mail className="w-3 h-3"/> 
                    <a href={`mailto:${selectedMsg.email}`} className="hover:text-[var(--color-primary)] hover:underline">{selectedMsg.email}</a>
                  </p>
                  <p className="flex items-center gap-2">
                    <Phone className="w-3 h-3"/> 
                    <a href={`tel:${selectedMsg.phone}`} className="hover:text-[var(--color-primary)] hover:underline">{selectedMsg.phone}</a>
                  </p>
                </div>
              </div>
            </div>

            {/* Message Body */}
            <div className="flex-1 p-6 overflow-y-auto custom-scrollbar bg-[var(--color-surface)]">
              <p className="text-[var(--color-text-primary)] whitespace-pre-wrap leading-relaxed">
                {selectedMsg.message}
              </p>
            </div>
            
            {/* Quick Reply Box */}
            <div className="p-4 border-t border-[var(--color-border)] bg-[var(--color-bg)] shrink-0">
               <textarea 
                  className="w-full text-sm bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg px-4 py-3 text-[var(--color-text-primary)] focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-none resize-none"
                  placeholder="Click here to reply via email integration (or use WhatsApp on mobile)..."
                  rows={2}
               />
               <div className="mt-2 flex justify-end">
                  <a href={`mailto:${selectedMsg.email}?subject=Re: ${(selectedMsg as any).subject || 'Your Inquiry'}`}>
                    <Button size="sm"><Mail className="w-4 h-4 mr-2"/> Send Email Reply</Button>
                  </a>
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
