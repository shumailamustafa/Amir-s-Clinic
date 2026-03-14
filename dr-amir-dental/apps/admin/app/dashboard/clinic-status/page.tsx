'use client';

import React, { useState, useEffect } from 'react';
import { Save, AlertTriangle, Clock } from 'lucide-react';
import { Button, Card, Input, Badge } from '@dental/ui';
import { subscribeToClinicConfig, updateClinicConfig } from '@dental/firebase';
import type { ClinicConfig, OpenHours, DayHours } from '@dental/types';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const;

export default function ClinicStatusPage() {
  const [isEmergencyClosed, setIsEmergencyClosed] = useState(false);
  const [emergencyMessage, setEmergencyMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [config, setConfig] = useState<ClinicConfig | null>(null);

  // Default state for hours
  const [hours, setHours] = useState<Record<string, DayHours>>(
    DAYS.reduce((acc, day) => {
      acc[day] = {
        isOpen: day !== 'sunday',
        open: '10:00',
        close: day === 'saturday' ? '16:00' : '20:00',
      };
      return acc;
    }, {} as Record<string, DayHours>)
  );

  useEffect(() => {
    const unsubscribe = subscribeToClinicConfig((data, error) => {
      if (error) {
        console.error('ClinicConfig sub error:', error);
      }
      if (data) {
        setConfig(data);
        setIsEmergencyClosed(data.holidayMode || false);
        setEmergencyMessage(data.emergencyMessage || '');

        if (data.openHours) {
          const newHours = { ...hours };
          DAYS.forEach(day => {
            if (data.openHours[day as keyof OpenHours]) {
              newHours[day] = data.openHours[day as keyof OpenHours];
            }
          });
          setHours(newHours);
        }
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const handleSaveHours = async () => {
    setSaving(true);
    try {
      const updatedHours: OpenHours = {
        monday: hours['monday'],
        tuesday: hours['tuesday'],
        wednesday: hours['wednesday'],
        thursday: hours['thursday'],
        friday: hours['friday'],
        saturday: hours['saturday'],
        sunday: hours['sunday'],
      };

      const { error } = await updateClinicConfig({
        openHours: updatedHours,
      });

      if (error) {
        toast.error(error);
      } else {
        toast.success('Working hours updated successfully');
      }
    } catch (error) {
      console.error('Error saving hours:', error);
      toast.error('Failed to save working hours');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleEmergency = async () => {
    setIsUpdating(true);
    try {
      const nextStatus = !isEmergencyClosed;
      const { error } = await updateClinicConfig({
        holidayMode: nextStatus,
        emergencyMessage: emergencyMessage, // Always sync the current message state when toggling
      });

      if (!error) {
        setIsEmergencyClosed(nextStatus);
        toast.success(nextStatus ? 'Emergency closure activated' : 'Clinic reopened');
      } else {
        toast.error(error);
      }
    } catch (err) {
      toast.error('Failed to update status');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUpdateMessage = async () => {
    setIsUpdating(true);
    try {
      const { error } = await updateClinicConfig({ emergencyMessage });
      if (!error) {
        toast.success('Emergency message updated');
      } else {
        toast.error(error);
      }
    } catch (err) {
      toast.error('Failed to update message');
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-primary)]"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-8 pb-20">
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Clinic Status & Hours</h1>
        <p className="text-[var(--color-text-secondary)]">Manage your regular working hours and emergency closures.</p>
      </div>

      {/* Emergency Override */}
      <Card className="p-6 border-red-500/30 bg-red-500/5">
        <div className="space-y-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-6 h-6 text-red-500" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-red-600 mb-1">Emergency Closure Override</h2>
                <p className="text-sm text-[var(--color-text-secondary)] max-w-md">
                  Instantly mark the clinic as closed across the website and show a public message to visitors.
                </p>
              </div>
            </div>
            <button
              onClick={handleToggleEmergency}
              disabled={isUpdating}
              className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none ${
                isEmergencyClosed ? 'bg-red-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-[var(--color-surface)] transition-transform ${
                  isEmergencyClosed ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <AnimatePresence>
            {isEmergencyClosed && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="pt-4 border-t border-red-200/30 space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-red-900 mb-2">Public Banner Message</label>
                  <textarea
                    value={emergencyMessage}
                    onChange={(e) => setEmergencyMessage(e.target.value)}
                    placeholder="Enter message for website visitors..."
                    className="w-full p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all resize-none h-28 text-sm text-[var(--color-text-primary)]"
                  />
                  <p className="mt-2 text-xs text-red-600/70 italic">
                    This message will appear at the top of the website while emergency closure is active.
                  </p>
                </div>
                <div className="flex justify-end">
                  <Button
                    onClick={handleUpdateMessage}
                    isLoading={isUpdating}
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    Update Banner Message
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Card>

      {/* Regular Hours */}
      <Card className="p-0 overflow-hidden">
        <div className="p-6 border-b border-[var(--color-border)] flex items-center justify-between bg-[var(--color-surface)]">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-[var(--color-primary)]" />
            <h2 className="text-lg font-bold text-[var(--color-text-primary)]">Regular Working Hours</h2>
          </div>
          <Button onClick={handleSaveHours} isLoading={saving} size="sm">
            <Save className="w-4 h-4 mr-2" /> Save Hours
          </Button>
        </div>
        
        <div className="divide-y divide-[var(--color-border)]">
          {DAYS.map((day) => (
            <div key={day} className="p-6 flex flex-col sm:flex-row sm:items-center gap-6 hover:bg-[var(--color-surface)]/50 transition-colors">
              <div className="w-36 shrink-0">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={hours[day].isOpen}
                    onChange={(e) => setHours({
                      ...hours,
                      [day]: { ...hours[day], isOpen: e.target.checked }
                    })}
                    className="w-5 h-5 accent-[var(--color-primary)] rounded border-[var(--color-border)] cursor-pointer"
                  />
                  <span className="font-bold text-[var(--color-text-primary)] capitalize group-hover:text-[var(--color-primary)] transition-colors">
                    {day}
                  </span>
                </label>
              </div>

              <div className="flex-1 flex items-center gap-4">
                {hours[day].isOpen ? (
                  <div className="flex items-center gap-4 animate-in fade-in slide-in-from-left-2 duration-300">
                    <div className="space-y-1">
                      <span className="text-[10px] uppercase font-bold text-[var(--color-text-secondary)] ml-1">Open</span>
                      <Input
                        type="time"
                        value={hours[day].open}
                        onChange={(e) => setHours({
                          ...hours,
                          [day]: { ...hours[day], open: e.target.value }
                        })}
                        className="w-36 h-10"
                      />
                    </div>
                    <div className="h-px w-4 bg-[var(--color-border)] mt-5"></div>
                    <div className="space-y-1">
                      <span className="text-[10px] uppercase font-bold text-[var(--color-text-secondary)] ml-1">Close</span>
                      <Input
                        type="time"
                        value={hours[day].close}
                        onChange={(e) => setHours({
                          ...hours,
                          [day]: { ...hours[day], close: e.target.value }
                        })}
                        className="w-36 h-10"
                      />
                    </div>
                  </div>
                ) : (
                  <Badge variant="closed" className="px-4 py-1.5 grayscale opacity-50">CLOSED</Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>
      
      {/* Footer Save Button */}
      <div className="flex justify-end pt-4">
        <Button onClick={handleSaveHours} isLoading={saving} size="lg" className="min-w-[200px] shadow-lg shadow-[var(--color-primary)]/20">
          <Save className="w-5 h-5 mr-1" />
          Save All Working Hours
        </Button>
      </div>
    </div>
  );
}
