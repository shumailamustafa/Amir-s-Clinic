'use client';

import React, { useState, useEffect } from 'react';
import { FileText, CheckCircle2, XCircle, Eye, Search, Filter, Settings, Plus, Trash2, Clock } from 'lucide-react';
import { Button, Card, Badge, Modal, Input } from '@dental/ui';
import { subscribeToAppointments, updateAppointmentStatus, subscribeToClinicConfig, updateClinicConfig } from '@dental/firebase';
import type { Appointment, ClinicConfig, OpenHours } from '@dental/types';
import { toast } from 'sonner';

export default function AppointmentsPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'confirmed' | 'settings'>('pending');
  const [selectedAppt, setSelectedAppt] = useState<Appointment | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Settings State
  const [slots, setSlots] = useState<string[]>([]);
  const [newSlot, setNewSlot] = useState('10:00 AM');
  const [savingSettings, setSavingSettings] = useState(false);
  const [clinicConfig, setClinicConfig] = useState<ClinicConfig | null>(null);

  useEffect(() => {
    const unsubscribeAppts = subscribeToAppointments((data, error) => {
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

    const unsubscribeConfig = subscribeToClinicConfig((config) => {
      if (config) {
        setClinicConfig(config);
        if (config.appointmentSlots) {
          setSlots(config.appointmentSlots);
        }
      }
    });

    return () => {
      unsubscribeAppts();
      unsubscribeConfig();
    };
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
      toast.error(`Failed to update status: ${error}`);
    } else {
      toast.success(`Appointment ${status}`);
    }
    setIsUpdating(false);
  };

  const handleAddSlot = () => {
    if (!newSlot) return;
    if (slots.includes(newSlot)) {
      toast.error('Slot already exists');
      return;
    }
    setSlots([...slots].sort((a, b) => {
      const timeA = new Date(`1970/01/01 ${a}`).getTime();
      const timeB = new Date(`1970/01/01 ${b}`).getTime();
      return timeA - timeB;
    }));
    setSlots(prev => [...prev, newSlot].sort()); // Simple sort for now, better to use time comparison
    // Real time sort:
    const sorted = [...slots, newSlot].sort((a, b) => {
      return new Date('1970/01/01 ' + a).getTime() - new Date('1970/01/01 ' + b).getTime();
    });
    setSlots(sorted);
    setNewSlot('');
  };

  const handleRemoveSlot = (slotToRemove: string) => {
    setSlots(slots.filter(s => s !== slotToRemove));
  };

  const handleSaveSettings = async () => {
    setSavingSettings(true);
    const { error } = await updateClinicConfig({
      appointmentSlots: slots
    });
    if (error) {
      toast.error('Failed to save settings');
    } else {
      toast.success('Booking settings updated');
    }
    setSavingSettings(false);
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
        <button 
          onClick={() => setActiveTab('settings')}
          className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'settings' ? 'border-[var(--color-primary)] text-[var(--color-primary)]' : 'border-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'}`}
        >
          <Settings className="w-4 h-4 inline mr-2" />
          Booking Settings
        </button>
      </div>

      {activeTab === 'settings' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Card className="p-6">
            <h3 className="text-lg font-bold text-[var(--color-text-primary)] mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-[var(--color-primary)]" />
              Manage Time Slots
            </h3>
            <p className="text-sm text-[var(--color-text-secondary)] mb-6">
              Define the available time intervals for appointments on the website.
            </p>

            <div className="flex gap-2 mb-6">
              <Input 
                type="text" 
                placeholder="e.g. 10:00 AM" 
                value={newSlot}
                onChange={(e) => setNewSlot(e.target.value)}
                className="flex-1"
              />
              <Button onClick={handleAddSlot}>
                <Plus className="w-4 h-4 mr-1" /> Add
              </Button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {slots.map(slot => (
                <div key={slot} className="group flex items-center justify-between p-2 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-[var(--color-primary)]/50 transition-all">
                  <span className="text-sm font-medium text-[var(--color-text-primary)]">{slot}</span>
                  <button 
                    onClick={() => handleRemoveSlot(slot)}
                    className="p-1 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-[var(--color-border)] flex justify-end">
              <Button onClick={handleSaveSettings} isLoading={savingSettings}>
                Save Changes
              </Button>
            </div>
          </Card>

          <Card className="p-6 bg-[var(--color-primary)]/5 border-[var(--color-primary)]/20">
            <h3 className="text-lg font-bold text-[var(--color-text-primary)] mb-4 flex items-center gap-2">
              <Search className="w-5 h-5 text-[var(--color-primary)]" />
              Available Days
            </h3>
            <p className="text-sm text-[var(--color-text-secondary)] mb-6">
              These days are currently enabled based on your <span className="font-bold">Clinic Status</span> settings.
            </p>

            <div className="space-y-3">
              {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map(day => {
                const isOpen = clinicConfig?.openHours?.[day as keyof OpenHours]?.isOpen;
                return (
                  <div key={day} className="flex items-center justify-between p-3 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)]">
                    <span className="text-sm font-bold capitalize text-[var(--color-text-primary)]">{day}</span>
                    <Badge variant={isOpen ? 'success' : 'closed'}>
                      {isOpen ? 'AVAILABLE' : 'OFF'}
                    </Badge>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 pt-6 border-t border-[var(--color-border)]">
              <p className="text-xs text-[var(--color-text-secondary)] mb-4">
                To change which days or hours the clinic is open, please visit the Status page.
              </p>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => window.location.href = '/dashboard/clinic-status'}
              >
                Go to Clinic Status
              </Button>
            </div>
          </Card>
        </div>
      ) : (
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
                        appt.paymentMethod === 'cash' ? <>Confirm Booking</> : <>Verify Payment</>
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
      )}

      {/* Detail/Verification Modal */}
      <Modal 
        isOpen={!!selectedAppt} 
        onClose={() => setSelectedAppt(null)}
        title={
          selectedAppt?.status === 'pending'
            ? selectedAppt?.paymentMethod === 'cash'
              ? "Confirm Cash Appointment"
              : "Verify Payment"
            : "Appointment Details"
        }
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
              
              {selectedAppt.paymentMethod !== 'cash' && (
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
              )}
              {selectedAppt.paymentMethod === 'cash' && (
                <div className="bg-[var(--color-surface)] p-6 rounded-xl text-center border border-dashed border-[var(--color-border)]">
                  <p className="text-[var(--color-primary)] font-bold text-lg mb-1">💰 Cash — Pay at Clinic</p>
                  <p className="text-sm text-[var(--color-text-secondary)]">
                    Patient has chosen to pay in person at the clinic.
                  </p>
                </div>
              )}
            </div>

            {selectedAppt.status === 'pending' && (
              <div className="flex gap-3 pt-4 border-t border-[var(--color-border)]">
                <Button 
                  className="flex-1 bg-[var(--color-status-open)] hover:bg-[var(--color-status-open)]"
                  isLoading={isUpdating}
                  onClick={() => handleUpdateStatus(selectedAppt.id, 'confirmed')}
                >
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  {selectedAppt.paymentMethod === 'cash' ? 'Confirm Booking' : 'Approve & Confirm'}
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
