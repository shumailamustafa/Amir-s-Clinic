'use client';

import React, { useState } from 'react';
import { Save, AlertTriangle } from 'lucide-react';
import { Button, Card, Input, Badge } from '@dental/ui';

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const;

export default function ClinicStatusPage() {
  const [isEmergencyClosed, setIsEmergencyClosed] = useState(false);
  const [emergencyMessage, setEmergencyMessage] = useState('');
  const [saving, setSaving] = useState(false);

  // Simulated state for hours
  const [hours, setHours] = useState(
    DAYS.reduce((acc, day) => {
      acc[day] = {
        isOpen: day !== 'sunday',
        open: '10:00',
        close: day === 'saturday' ? '16:00' : '20:00',
      };
      return acc;
    }, {} as Record<string, { isOpen: boolean; open: string; close: string }>)
  );

  const handleSave = async () => {
    setSaving(true);
    // Simulate Firestore save
    await new Promise(r => setTimeout(r, 1000));
    setSaving(false);
  };

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Clinic Status & Hours</h1>
        <p className="text-[var(--color-text-secondary)]">Manage your regular working hours and emergency closures.</p>
      </div>

      {/* Emergency Override */}
      <Card className="p-6 border-red-500/30 bg-red-500/5">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-6 h-6 text-red-500" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-bold text-red-500 mb-2">Emergency Closure Override</h2>
            <p className="text-sm text-[var(--color-text-secondary)] mb-4">
              Instantly mark the clinic as closed across the website. Appointments cannot be booked for today.
            </p>
            
            <div className="space-y-4 max-w-md">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isEmergencyClosed}
                  onChange={(e) => setIsEmergencyClosed(e.target.checked)}
                  className="w-5 h-5 accent-red-500 rounded border-[var(--color-border)]"
                />
                <span className="font-medium text-[var(--color-text-primary)]">
                  Activate Emergency Closure
                </span>
                {isEmergencyClosed && <Badge variant="closed" pulse>Currently Closed</Badge>}
              </label>

              {isEmergencyClosed && (
                <div className="pt-2">
                  <Input
                    label="Public Banner Message"
                    placeholder="e.g., Closed today due to maintenance."
                    value={emergencyMessage}
                    onChange={(e) => setEmergencyMessage(e.target.value)}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Regular Hours */}
      <Card className="p-0 overflow-hidden">
        <div className="p-6 border-b border-[var(--color-border)] flex items-center justify-between">
          <h2 className="text-lg font-bold text-[var(--color-text-primary)]">Regular Working Hours</h2>
          <Button onClick={handleSave} isLoading={saving} size="sm">
            <Save className="w-4 h-4 mr-2" /> Save Global Changes
          </Button>
        </div>
        
        <div className="divide-y divide-[var(--color-border)]">
          {DAYS.map((day) => (
            <div key={day} className="p-6 flex flex-col sm:flex-row sm:items-center gap-4 hover:bg-[var(--color-surface)] transition-colors">
              <div className="w-32">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hours[day].isOpen}
                    onChange={(e) => setHours({
                      ...hours,
                      [day]: { ...hours[day], isOpen: e.target.checked }
                    })}
                    className="w-5 h-5 accent-[var(--color-primary)] rounded border-[var(--color-border)]"
                  />
                  <span className="font-semibold text-[var(--color-text-primary)] capitalize">{day}</span>
                </label>
              </div>

              {hours[day].isOpen ? (
                <div className="flex items-center gap-4 flex-1">
                  <Input
                    type="time"
                    value={hours[day].open}
                    onChange={(e) => setHours({
                      ...hours,
                      [day]: { ...hours[day], open: e.target.value }
                    })}
                    className="w-32"
                  />
                  <span className="text-[var(--color-text-secondary)]">to</span>
                  <Input
                    type="time"
                    value={hours[day].close}
                    onChange={(e) => setHours({
                      ...hours,
                      [day]: { ...hours[day], close: e.target.value }
                    })}
                    className="w-32"
                  />
                </div>
              ) : (
                <div className="flex-1">
                  <Badge variant="closed">Closed</Badge>
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>
      
      {/* Spacer for bottom save button */}
      <div className="flex justify-end pt-4">
        <Button onClick={handleSave} isLoading={saving} size="lg">
          <Save className="w-5 h-5 mr-2" />
          Save All Changes
        </Button>
      </div>
    </div>
  );
}
