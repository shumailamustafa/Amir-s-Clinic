'use client';

import React, { useState, useEffect } from 'react';
import { Save, Plus, Trash2, GraduationCap, Briefcase, Languages, Award, Zap } from 'lucide-react';
import { Button, Card, Input } from '@dental/ui';
import { getDoctorProfile, updateDoctorProfile } from '@dental/firebase';
import type { DoctorProfile, Education, Experience, Skill, Achievement } from '@dental/types';

export default function AboutPage() {
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  // Form State
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [bio, setBio] = useState('');
  const [education, setEducation] = useState<Education[]>([]);
  const [experience, setExperience] = useState<Experience[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  useEffect(() => {
    async function load() {
      const data = await getDoctorProfile();
      if (data) {
        setName(data.name || '');
        setTitle(data.title || '');
        setBio(data.bio || '');
        setEducation(data.education || []);
        setExperience(data.experience || []);
        setSkills(data.skills || []);
        setAchievements(data.achievements || []);
      }
      setLoading(false);
    }
    load();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateDoctorProfile({
        name, title, bio, education, experience, skills, achievements
      });
      alert('Profile saved successfully!');
    } catch (e) {
      console.error('Failed to save profile', e);
      alert('Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  const updateItem = <T,>(setter: React.Dispatch<React.SetStateAction<T[]>>, index: number, field: keyof T, value: any) => {
    setter(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const removeItem = <T,>(setter: React.Dispatch<React.SetStateAction<T[]>>, index: number) => {
    setter(prev => prev.filter((_, i) => i !== index));
  };

  if (loading) return <div className="p-8 text-[var(--color-text-secondary)]">Loading profile data...</div>;

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
          <Input label="Name" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Dr. Amir" />
          <Input label="Title" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. BDS, FCPS — Dental Surgeon" />
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1.5">Bio</label>
            <textarea 
              className="w-full px-4 py-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] resize-y min-h-[120px]"
              value={bio}
              onChange={e => setBio(e.target.value)}
              placeholder="With over 15 years of experience in modern dentistry..."
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
            <Button variant="ghost" size="sm" onClick={() => setEducation([...education, { degree: '', institution: '', year: '' }])}>
              <Plus className="w-4 h-4 mr-1" /> Add
            </Button>
          </div>
          <div className="space-y-4">
            {education.map((edu, i) => (
              <div key={i} className="flex gap-2">
                <div className="flex-1 space-y-2">
                  <Input placeholder="Degree (e.g. BDS)" value={edu.degree || ''} onChange={e => updateItem(setEducation, i, 'degree', e.target.value)} />
                  <div className="flex gap-2">
                    <Input placeholder="Institution" value={edu.institution || ''} onChange={e => updateItem(setEducation, i, 'institution', e.target.value)} className="flex-1" />
                    <Input placeholder="Year" value={edu.year || ''} onChange={e => updateItem(setEducation, i, 'year', e.target.value)} className="w-24" />
                  </div>
                </div>
                <Button variant="ghost" className="text-red-500 h-10 px-2 mt-auto" onClick={() => removeItem(setEducation, i)}><Trash2 className="w-4 h-4" /></Button>
              </div>
            ))}
            {education.length === 0 && <p className="text-sm text-[var(--color-text-secondary)]">No education added.</p>}
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4 border-b border-[var(--color-border)] pb-2">
            <h2 className="text-lg font-bold text-[var(--color-text-primary)] flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-[var(--color-primary)]" /> Experience
            </h2>
            <Button variant="ghost" size="sm" onClick={() => setExperience([...experience, { role: '', place: '', duration: '' }])}>
              <Plus className="w-4 h-4 mr-1" /> Add
            </Button>
          </div>
          <div className="space-y-4">
            {experience.map((exp, i) => (
              <div key={i} className="flex gap-2">
                <div className="flex-1 space-y-2">
                  <Input placeholder="Role" value={exp.role || ''} onChange={e => updateItem(setExperience, i, 'role', e.target.value)} />
                  <div className="flex gap-2">
                    <Input placeholder="Place/Clinic" value={exp.place || ''} onChange={e => updateItem(setExperience, i, 'place', e.target.value)} className="flex-1" />
                    <Input placeholder="Duration" value={exp.duration || ''} onChange={e => updateItem(setExperience, i, 'duration', e.target.value)} className="w-32" />
                  </div>
                </div>
                <Button variant="ghost" className="text-red-500 h-10 px-2 mt-auto" onClick={() => removeItem(setExperience, i)}><Trash2 className="w-4 h-4" /></Button>
              </div>
            ))}
            {experience.length === 0 && <p className="text-sm text-[var(--color-text-secondary)]">No experience added.</p>}
          </div>
        </Card>
      </div>

      {/* Skills & Achievements Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4 border-b border-[var(--color-border)] pb-2">
            <h2 className="text-lg font-bold text-[var(--color-text-primary)] flex items-center gap-2">
              <Zap className="w-5 h-5 text-[var(--color-primary)]" /> Skills
            </h2>
            <Button variant="ghost" size="sm" onClick={() => setSkills([...skills, { name: '', percentage: 0 }])}>
              <Plus className="w-4 h-4 mr-1" /> Add
            </Button>
          </div>
          <div className="space-y-4">
            {skills.map((skill, i) => (
              <div key={i} className="flex gap-2">
                <Input placeholder="Skill (e.g. Implantology)" value={skill.name || ''} onChange={e => updateItem(setSkills, i, 'name', e.target.value)} className="flex-1" />
                <Input type="number" placeholder="%" value={skill.percentage?.toString() || ''} onChange={e => updateItem(setSkills, i, 'percentage', parseInt(e.target.value) || 0)} className="w-24" />
                <Button variant="ghost" className="text-red-500 h-10 px-2" onClick={() => removeItem(setSkills, i)}><Trash2 className="w-4 h-4" /></Button>
              </div>
            ))}
            {skills.length === 0 && <p className="text-sm text-[var(--color-text-secondary)]">No skills added.</p>}
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4 border-b border-[var(--color-border)] pb-2">
            <h2 className="text-lg font-bold text-[var(--color-text-primary)] flex items-center gap-2">
              <Award className="w-5 h-5 text-[var(--color-primary)]" /> Achievements
            </h2>
            <Button variant="ghost" size="sm" onClick={() => setAchievements([...achievements, { title: '', icon: 'Award' }])}>
              <Plus className="w-4 h-4 mr-1" /> Add
            </Button>
          </div>
          <div className="space-y-4">
            {achievements.map((ach, i) => (
              <div key={i} className="flex gap-2">
                <Input placeholder="Achievement Title" value={ach.title || ''} onChange={e => updateItem(setAchievements, i, 'title', e.target.value)} className="flex-1" />
                <Input placeholder="Icon Name" value={ach.icon || ''} onChange={e => updateItem(setAchievements, i, 'icon', e.target.value)} className="w-32" />
                <Button variant="ghost" className="text-red-500 h-10 px-2" onClick={() => removeItem(setAchievements, i)}><Trash2 className="w-4 h-4" /></Button>
              </div>
            ))}
            {achievements.length === 0 && <p className="text-sm text-[var(--color-text-secondary)]">No achievements added.</p>}
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
