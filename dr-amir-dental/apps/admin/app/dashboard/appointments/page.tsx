'use client';

import React, { useState } from 'react';
import { FileText, CheckCircle2, XCircle, Eye, Search, Filter } from 'lucide-react';
import { Button, Card, Badge, Modal } from '@dental/ui';

// Placeholder data
const MOCK_APPOINTMENTS = [
  { id: '1', ref: 'REF-A1B2C', patient: 'Ahmed Khan', phone: '0300-1111111', date: '2024-03-15', time: '10:00 AM', service: 'Dental Implants', status: 'pending_payment', createdAt: '2024-03-10' },
  { id: '2', ref: 'REF-X9Y8Z', patient: 'Fatima Ali', phone: '0300-2222222', date: '2024-03-15', time: '11:30 AM', service: 'Teeth Whitening', status: 'confirmed', createdAt: '2024-03-09' },
  { id: '3', ref: 'REF-M4N5P', patient: 'Usman Raza', phone: '0300-3333333', date: '2024-03-16', time: '02:00 PM', service: 'Root Canal', status: 'cancelled', createdAt: '2024-03-08' },
  { id: '4', ref: 'REF-J7K8L', patient: 'Ayesha Syed', phone: '0300-4444444', date: '2024-03-16', time: '04:30 PM', service: 'General Checkup', status: 'pending_payment', createdAt: '2024-03-11' },
];

export default function AppointmentsPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'confirmed'>('pending');
  const [selectedAppt, setSelectedAppt] = useState<any>(null);

  const filtered = MOCK_APPOINTMENTS.filter(a => {
    if (activeTab === 'all') return true;
    if (activeTab === 'pending') return a.status === 'pending_payment';
    if (activeTab === 'confirmed') return a.status === 'confirmed';
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Appointments</h1>
          <p className="text-[var(--color-text-secondary)]">Manage bookings and verify payments.</p>
        </div>
        
        {/* Filters/Search */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)]" />
            <input 
              type="text" 
              placeholder="Search ref or name..." 
              className="pl-9 pr-4 py-2 text-sm bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            />
          </div>
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" /> Filter Date
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-[var(--color-border)] mb-6">
        <button 
          onClick={() => setActiveTab('pending')}
          className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'pending' ? 'border-[var(--color-primary)] text-[var(--color-primary)]' : 'border-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'}`}
        >
          Requires Attention 
          <span className="ml-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">2</span>
        </button>
        <button 
          onClick={() => setActiveTab('confirmed')}
          className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'confirmed' ? 'border-[var(--color-primary)] text-[var(--color-primary)]' : 'border-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'}`}
        >
          Confirmed
        </button>
        <button 
          onClick={() => setActiveTab('all')}
          className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'all' ? 'border-[var(--color-primary)] text-[var(--color-primary)]' : 'border-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'}`}
        >
          All Appointments
        </button>
      </div>

      {/* List */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[var(--color-surface)] border-b border-[var(--color-border)] text-[var(--color-text-secondary)] text-sm">
                <th className="p-4 font-medium">Ref & Patient</th>
                <th className="p-4 font-medium">Date & Time</th>
                <th className="p-4 font-medium">Service</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {filtered.map(appt => (
                <tr key={appt.id} className="hover:bg-[var(--color-surface)]/50 transition-colors">
                  <td className="p-4">
                    <p className="font-bold text-[var(--color-text-primary)] text-sm">{appt.ref}</p>
                    <p className="text-sm font-medium text-[var(--color-text-primary)] mt-0.5">{appt.patient}</p>
                    <p className="text-xs text-[var(--color-text-secondary)]">{appt.phone}</p>
                  </td>
                  <td className="p-4">
                    <p className="font-medium text-[var(--color-text-primary)] text-sm">{appt.date}</p>
                    <p className="text-xs text-[var(--color-primary)] font-semibold mt-0.5">{appt.time}</p>
                  </td>
                  <td className="p-4 text-sm text-[var(--color-text-secondary)]">{appt.service}</td>
                  <td className="p-4">
                    <Badge variant={appt.status === 'confirmed' ? 'success' : appt.status === 'pending_payment' ? 'pending' : 'closed'}>
                      {appt.status.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </td>
                  <td className="p-4 text-right">
                    <Button variant="outline" size="sm" onClick={() => setSelectedAppt(appt)}>
                      {appt.status === 'pending_payment' ? (
                        <>Verify Payment</>
                      ) : (
                        <>View Details</>
                      )}
                    </Button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-[var(--color-text-secondary)]">
                    No appointments found for this filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Detail/Verification Modal */}
      <Modal 
        isOpen={!!selectedAppt} 
        onClose={() => setSelectedAppt(null)}
        title={selectedAppt?.status === 'pending_payment' ? "Verify Payment" : "Appointment Details"}
        size="lg"
      >
        {selectedAppt && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4 bg-[var(--color-surface)] p-4 rounded-xl border border-[var(--color-border)]">
              <div>
                <p className="text-xs text-[var(--color-text-secondary)] uppercase tracking-wider font-semibold">Patient</p>
                <p className="font-bold text-[var(--color-text-primary)] text-lg">{selectedAppt.patient}</p>
                <p className="text-sm text-[var(--color-text-secondary)]">{selectedAppt.phone}</p>
              </div>
              <div>
                <p className="text-xs text-[var(--color-text-secondary)] uppercase tracking-wider font-semibold">Schedule</p>
                <p className="font-bold text-[var(--color-text-primary)]">{selectedAppt.date}</p>
                <p className="text-sm font-semibold text-[var(--color-primary)]">{selectedAppt.time}</p>
              </div>
            </div>

            <div className="border-t border-[var(--color-border)] pt-6">
              <h3 className="font-bold text-[var(--color-text-primary)] mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-[var(--color-text-secondary)]" />
                Payment Screenshot
              </h3>
              
              <div className="aspect-video bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] flex flex-col items-center justify-center text-[var(--color-text-secondary)]">
                <p className="text-sm mb-2">Simulated Image Viewer</p>
                <Button variant="outline" size="sm">
                  <Eye className="w-4 h-4 mr-2" /> View Full Image
                </Button>
              </div>
            </div>

            {selectedAppt.status === 'pending_payment' && (
              <div className="flex gap-3 pt-4 border-t border-[var(--color-border)]">
                <Button className="flex-1 bg-[var(--color-status-open)] hover:bg-[var(--color-status-open)]">
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Approve & Confirm
                </Button>
                <Button variant="outline" className="flex-1 text-red-500 hover:text-red-600 hover:bg-red-50/10 border-red-500/30">
                  <XCircle className="w-4 h-4 mr-2" />
                  Reject & Request Again
                </Button>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
