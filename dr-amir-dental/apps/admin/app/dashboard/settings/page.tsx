'use client';

import React, { useState } from 'react';
import { Save, Copy, CheckCircle2 } from 'lucide-react';
import { Button, Card, Input } from '@dental/ui';

export default function SettingsPage() {
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 1000));
    setSaving(false);
  };

  const copyRef = () => {
    navigator.clipboard.writeText('https://dramirdental.com');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-3xl space-y-8 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">System Settings</h1>
          <p className="text-[var(--color-text-secondary)]">Manage clinic contact data, payment details, and admin credentials.</p>
        </div>
        <Button onClick={handleSave} isLoading={saving}>
          <Save className="w-4 h-4 mr-2" /> Save Settings
        </Button>
      </div>

      <Card className="p-6 space-y-6">
        <h2 className="text-lg font-bold text-[var(--color-text-primary)] border-b border-[var(--color-border)] pb-2">Public Contact Info</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Primary Phone (WhatsApp)" defaultValue="0300-1234567" />
          <Input label="Public Email" type="email" defaultValue="contact@dramirdental.com" />
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1.5">Full Address</label>
            <textarea 
              className="w-full px-4 py-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] resize-y"
              defaultValue="123 Health Avenue, Phase 5, DHA, Lahore, Pakistan"
              rows={2}
            />
          </div>
          <div className="md:col-span-2">
            <Input label="Google Maps Embed URL" defaultValue="https://maps.google.com/..." />
          </div>
        </div>
        
        <h3 className="text-sm font-bold text-[var(--color-text-primary)] pt-4">Social Media Links</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input label="Facebook URL" defaultValue="https://facebook.com" />
          <Input label="Instagram URL" defaultValue="https://instagram.com" />
          <Input label="Twitter URL" defaultValue="" placeholder="Optional" />
        </div>
      </Card>

      <Card className="p-6 space-y-6">
        <h2 className="text-lg font-bold text-[var(--color-text-primary)] border-b border-[var(--color-border)] pb-2">Payment Details</h2>
        <p className="text-sm text-[var(--color-text-secondary)]">These details are shown to patients when they choose 'Online Payment' during booking.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="JazzCash / Easypaisa Title" defaultValue="Dr. Amir" />
          <Input label="Account / Mobile Number" defaultValue="0300-1234567" />
          <Input label="Bank Name (Optional)" placeholder="e.g. Meezan Bank" />
          <Input label="IBAN (Optional)" placeholder="PK..." />
        </div>
      </Card>

      <Card className="p-6 border-red-500/30">
        <h2 className="text-lg font-bold text-[var(--color-text-primary)] border-b border-[var(--color-border)] pb-2">Admin Security</h2>
        <p className="text-sm text-[var(--color-text-secondary)] mb-4 mt-2">
          Administrator login uses environment variables. To change your password, update the <code className="bg-[var(--color-surface)] px-1 py-0.5 rounded text-[var(--color-primary)]">.env.local</code> file on the server.
        </p>
        
        <div className="p-4 bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] font-mono text-sm max-w-sm">
           <div className="flex justify-between items-center mb-2">
             <span className="text-[var(--color-text-secondary)]">Current Settings:</span>
           </div>
           <div><span className="text-[var(--color-primary)]">ADMIN_EMAIL</span>=admin@dramirdental.com</div>
           <div><span className="text-[var(--color-primary)]">ADMIN_PASSWORD</span>=********</div>
        </div>
      </Card>
      
      <div className="flex justify-end pt-4">
         <p className="text-xs text-[var(--color-text-tertiary)] text-center w-full">System v1.0.0 — Next.js Admin Panel</p>
      </div>
    </div>
  );
}
