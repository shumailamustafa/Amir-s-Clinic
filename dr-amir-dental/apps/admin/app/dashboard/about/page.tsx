'use client';

import React, { useState } from 'react';
import { Save, Plus, Trash2, GraduationCap, Briefcase, Languages } from 'lucide-react';
import { Button, Card, Input } from '@dental/ui';

export default function AboutPage() {
  const [saving, setSaving] = useState(false);

  // Mocks
  const [education, setEducation] = useState([{ institution: 'King Edward Medical University', degree: 'BDS', year: '2005' }]);
  const [experience, setExperience] = useState([{ place: 'Mayo Hospital Lahore', role: 'Dental Surgeon', duration: '2005-2010' }]);

  const handleSave = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 1000));
    setSaving(false);
  };

  return (
    <div className="max-w-4xl space-y-8 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">About Management</h1>
          <p className="text-[var(--color-text-secondary)]">Update doctor profile, education, and clinic gallery.</p>
        </div>
        <Button onClick={handleSave} isLoading={saving}>
          <Save className="w-4 h-4 mr-2" /> Save Changes
        </Button>
      </div>

      {/* Doctor Profile Basic */}
      <Card className="p-6">
        <h2 className="text-lg font-bold text-[var(--color-text-primary)] mb-6 border-b border-[var(--color-border)] pb-2">Doctor Profile</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input label="Name" defaultValue="Dr. Amir" />
          <Input label="Title" defaultValue="BDS, FCPS — Dental Surgeon" />
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1.5">Bio</label>
            <textarea 
              className="w-full px-4 py-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] resize-y min-h-[120px]"
              defaultValue="With over 15 years of experience in modern dentistry..."
            />
          </div>
        </div>
      </Card>

      {/* Education & Experience Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4 border-b border-[var(--color-border)] pb-2">
            <h2 className="text-lg font-bold text-[var(--color-text-primary)] flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-[var(--color-primary)]" /> Education
            </h2>
            <Button variant="ghost" size="sm"><Plus className="w-4 h-4 mr-1" /> Add</Button>
          </div>
          <div className="space-y-4">
            {education.map((edu, i) => (
              <div key={i} className="flex gap-2">
                <div className="flex-1 space-y-2">
                  <Input placeholder="Degree (e.g. BDS)" defaultValue={edu.degree} />
                  <div className="flex gap-2">
                    <Input placeholder="Institution" defaultValue={edu.institution} className="flex-1" />
                    <Input placeholder="Year" defaultValue={edu.year} className="w-24" />
                  </div>
                </div>
                <Button variant="ghost" className="text-red-500 h-10 px-2 mt-auto"><Trash2 className="w-4 h-4" /></Button>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4 border-b border-[var(--color-border)] pb-2">
            <h2 className="text-lg font-bold text-[var(--color-text-primary)] flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-[var(--color-primary)]" /> Experience
            </h2>
            <Button variant="ghost" size="sm"><Plus className="w-4 h-4 mr-1" /> Add</Button>
          </div>
          <div className="space-y-4">
            {experience.map((exp, i) => (
              <div key={i} className="flex gap-2">
                <div className="flex-1 space-y-2">
                  <Input placeholder="Role" defaultValue={exp.role} />
                  <div className="flex gap-2">
                    <Input placeholder="Place/Clinic" defaultValue={exp.place} className="flex-1" />
                    <Input placeholder="Duration" defaultValue={exp.duration} className="w-32" />
                  </div>
                </div>
                <Button variant="ghost" className="text-red-500 h-10 px-2 mt-auto"><Trash2 className="w-4 h-4" /></Button>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Clinic Gallery */}
      <Card className="p-6">
        <h2 className="text-lg font-bold text-[var(--color-text-primary)] mb-4 border-b border-[var(--color-border)] pb-2">Clinic Gallery</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1,2,3].map(i => (
            <div key={i} className="aspect-square bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl relative group">
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-xl">
                <Button variant="ghost" className="text-red-400 hover:text-red-500 hover:bg-white/10"><Trash2 className="w-5 h-5" /></Button>
              </div>
              <div className="w-full h-full flex items-center justify-center text-[var(--color-text-secondary)] text-sm">Image {i}</div>
            </div>
          ))}
          <div className="aspect-square border-2 border-dashed border-[var(--color-border)] hover:border-[var(--color-primary)] rounded-xl flex flex-col items-center justify-center cursor-pointer transition-colors text-[var(--color-text-secondary)] hover:text-[var(--color-primary)]">
            <Plus className="w-8 h-8 mb-2" />
            <span className="text-sm font-medium">Add Photo</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
