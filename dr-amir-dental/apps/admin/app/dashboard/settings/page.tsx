'use client';

import React, { useState, useEffect } from 'react';
import { Save, Copy, CheckCircle2 } from 'lucide-react';
import { Button, Card, Input } from '@dental/ui';
import { subscribeToClinicConfig, updateClinicConfig } from '@dental/firebase';
import type { ClinicConfig } from '@dental/types';

export default function SettingsPage() {
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [config, setConfig] = useState<ClinicConfig | null>(null);

  useEffect(() => {
    const unsub = subscribeToClinicConfig((data, error) => {
      if (error) {
        console.error('SettingsPage sub error:', error);
        return;
      }
      setConfig(data);
    });
    return unsub;
  }, []);

  const handleSave = async () => {
    if (!config) return;
    setSaving(true);
    try {
      await updateClinicConfig(config);
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Failed to save settings', error);
      alert('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const copyRef = () => {
    navigator.clipboard.writeText('https://dramirdental.com');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!config) return <div className="p-8 text-[var(--color-text-secondary)]">Loading settings...</div>;

  const updateField = (field: keyof ClinicConfig, value: any) => {
    setConfig({ ...config, [field]: value });
  };

  const updateNestedField = (parent: keyof ClinicConfig, field: string, value: any) => {
    setConfig({
      ...config,
      [parent]: {
        ...(config[parent] as any),
        [field]: value
      }
    });
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
          <Input label="Primary Phone (WhatsApp)" value={config.whatsapp} onChange={(e) => updateField('whatsapp', e.target.value)} />
          <Input label="Public Email" type="email" value={config.email} onChange={(e) => updateField('email', e.target.value)} />
          <Input label="Clinic Phone" value={config.phone} onChange={(e) => updateField('phone', e.target.value)} />
          <Input label="Tagline" value={config.tagline} onChange={(e) => updateField('tagline', e.target.value)} />
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1.5">Full Address</label>
            <textarea 
              className="w-full px-4 py-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] resize-y"
              value={config.address}
              onChange={(e) => updateField('address', e.target.value)}
              rows={2}
            />
          </div>
        </div>
        
        <h3 className="text-sm font-bold text-[var(--color-text-primary)] pt-4">Social Media Links</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input label="Facebook URL" value={config.socialLinks.facebook} onChange={(e) => updateNestedField('socialLinks', 'facebook', e.target.value)} />
          <Input label="Instagram URL" value={config.socialLinks.instagram} onChange={(e) => updateNestedField('socialLinks', 'instagram', e.target.value)} />
          <Input label="TikTok URL" value={config.socialLinks.tiktok} onChange={(e) => updateNestedField('socialLinks', 'tiktok', e.target.value)} />
          <Input label="LinkedIn URL" value={config.socialLinks.linkedin} onChange={(e) => updateNestedField('socialLinks', 'linkedin', e.target.value)} />
          <Input label="YouTube URL" value={config.socialLinks.youtube} onChange={(e) => updateNestedField('socialLinks', 'youtube', e.target.value)} />
        </div>
      </Card>

      <Card className="p-6 space-y-6">
        <h2 className="text-lg font-bold text-[var(--color-text-primary)] border-b border-[var(--color-border)] pb-2">Payment Details</h2>
        <p className="text-sm text-[var(--color-text-secondary)]">These details are shown to patients when they choose 'Online Payment' during booking.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2 border border-dashed border-[var(--color-border)] rounded-xl p-6 text-center text-sm text-[var(--color-text-secondary)]">
            Payment details are currently hardcoded in the frontend. Implement mapping if needed.
          </div>
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
