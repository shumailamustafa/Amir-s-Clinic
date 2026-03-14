'use client';

import React, { useState, useEffect } from 'react';
import { FileText, CheckCircle2, XCircle, Eye, Search, Filter } from 'lucide-react';
import { Button, Card, Badge, Modal } from '@dental/ui';
import { subscribeToAppointments, updateAppointmentStatus } from '@dental/firebase';
import type { Appointment } from '@dental/types';

export default function AppointmentsPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'confirmed'>('pending');
  const [selectedAppt, setSelectedAppt] = useState<Appointment | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeToAppointments((data, error) => {
      if (error) {
        console.error('AppointmentsPage sub error:', error);
        return;
      }
      setAppointments(data);
      if (selectedAppt) {
        const updatedSelected = data.find(a => a.id === selectedAppt.id);
        if (updatedSelected) setSelectedAppt(updatedSelected);
      }
    });
    return unsubscribe;
  }, [selectedAppt]);

  const filtered = appointments.filter(a => {
    const matchesSearch = 
      a.referenceNumber.toLowerCase().includes(searchQuery.toLowerCase()) || 
      a.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.phone.includes(searchQuery);

    if (!matchesSearch) return false;

    if (activeTab === 'all') return true;
    if (activeTab === 'pending') return a.status === 'pending';
    if (activeTab === 'confirmed') return a.status === 'confirmed';
    return true;
  });

  const handleUpdateStatus = async (id: string, status: 'confirmed' | 'cancelled') => {
    setIsUpdating(true);
    const { error } = await updateAppointmentStatus(id, status);
    if (error) {
      alert(`Failed to update status: ${error}`);
    }
    setIsUpdating(false);
  };


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
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
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
          <span className="ml-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
            {appointments.filter(a => a.status === 'pending').length}
          </span>
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
                    <p className="font-bold text-[var(--color-text-primary)] text-sm">{appt.referenceNumber}</p>
                    <p className="text-sm font-medium text-[var(--color-text-primary)] mt-0.5">{appt.patientName}</p>
                    <p className="text-xs text-[var(--color-text-secondary)]">{appt.phone}</p>
                  </td>
                  <td className="p-4">
                    <p className="font-medium text-[var(--color-text-primary)] text-sm">{appt.date}</p>
                    <p className="text-xs text-[var(--color-primary)] font-semibold mt-0.5">{appt.timeSlot}</p>
                  </td>
                  <td className="p-4 text-sm text-[var(--color-text-secondary)]">{appt.serviceId}</td>
                  <td className="p-4">
                    <Badge variant={appt.status === 'confirmed' ? 'success' : appt.status === 'pending' ? 'pending' : 'closed'}>
                      {appt.status.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </td>
                  <td className="p-4 text-right">
                    <Button variant="outline" size="sm" onClick={() => setSelectedAppt(appt)}>
                      {appt.status === 'pending' ? (
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
        title={selectedAppt?.status === 'pending' ? "Verify Payment" : "Appointment Details"}
        size="lg"
      >
        {selectedAppt && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4 bg-[var(--color-surface)] p-4 rounded-xl border border-[var(--color-border)]">
              <div>
                <p className="text-xs text-[var(--color-text-secondary)] uppercase tracking-wider font-semibold">Patient</p>
                <p className="font-bold text-[var(--color-text-primary)] text-lg">{selectedAppt.patientName}</p>
                <p className="text-sm text-[var(--color-text-secondary)]">{selectedAppt.phone}</p>
              </div>
              <div>
                <p className="text-xs text-[var(--color-text-secondary)] uppercase tracking-wider font-semibold">Schedule</p>
                <p className="font-bold text-[var(--color-text-primary)]">{selectedAppt.date}</p>
                <p className="text-sm font-semibold text-[var(--color-primary)]">{selectedAppt.timeSlot}</p>
              </div>
            </div>

            <div className="border-t border-[var(--color-border)] pt-6">
              <h3 className="font-bold text-[var(--color-text-primary)] mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-[var(--color-text-secondary)]" />
                Payment Screenshot
              </h3>
              
              <div className="aspect-video bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] flex flex-col items-center justify-center text-[var(--color-text-secondary)] overflow-hidden relative">
                {selectedAppt.paymentScreenshotUrl ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={selectedAppt.paymentScreenshotUrl} alt="Payment Receipt" className="w-full h-full object-contain" />
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="absolute bottom-4 right-4 bg-black/50 text-white hover:bg-black/70 border-none"
                      onClick={() => window.open(selectedAppt.paymentScreenshotUrl, '_blank')}
                    >
                      <Eye className="w-4 h-4 mr-2" /> View Full Image
                    </Button>
                  </>
                ) : (
                  <p className="text-sm mb-2 text-center text-red-400">No payment screenshot uploaded</p>
                )}
              </div>
            </div>

            {selectedAppt.status === 'pending' && (
              <div className="flex gap-3 pt-4 border-t border-[var(--color-border)]">
                <Button 
                  className="flex-1 bg-[var(--color-status-open)] hover:bg-[var(--color-status-open)]"
                  isLoading={isUpdating}
                  onClick={() => handleUpdateStatus(selectedAppt.id, 'confirmed')}
                >
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Approve & Confirm
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1 text-red-500 hover:text-red-600 hover:bg-red-50/10 border-red-500/30"
                  isLoading={isUpdating}
                  onClick={() => handleUpdateStatus(selectedAppt.id, 'cancelled')}
                >
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
