'use client';

import React, { useState, useEffect } from 'react';
import { Save, Plus, Trash2, GraduationCap, Briefcase, Languages, Award, Zap, Image as ImageIcon, Clock, MapPin, Building, Phone, Mail, Globe } from 'lucide-react';
import { Button, Card, Input } from '@dental/ui';
import { getDoctorProfile, updateDoctorProfile, getClinicConfig, updateClinicConfig, uploadToCloudinary } from '@dental/firebase';
import type { DoctorProfile, Education, Experience, Skill, Achievement, ClinicConfig } from '@dental/types';

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
  const [clinicConfig, setClinicConfig] = useState<ClinicConfig | null>(null);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [profileImageUrl, setProfileImageUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isUploadingProfile, setIsUploadingProfile] = useState(false);

  useEffect(() => {
    async function load() {
      const [profileRes, clinicRes] = await Promise.all([
        getDoctorProfile(),
        getClinicConfig()
      ]);

      if (profileRes.data) {
        const data = profileRes.data;
        setName(data.name || '');
        setTitle(data.title || '');
        setBio(data.bio || '');
        setEducation(data.education || []);
        setExperience(data.experience || []);
        setSkills(data.skills || []);
        setAchievements(data.achievements || []);
        setProfileImageUrl(data.profileImageUrl || '');
      }

      if (clinicRes.data) {
        setClinicConfig(clinicRes.data);
        setGalleryImages(clinicRes.data.galleryImages || []);
      }

      setLoading(false);
    }
    load();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    const { error } = await updateDoctorProfile({
      name, title, bio, education, experience, skills, achievements,
      profileImageUrl
    } as DoctorProfile);

    if (error) {
      alert(`Failed to save doctor profile: ${error}`);
    } else {
      alert('Doctor profile saved successfully!');
    }
    setSaving(false);
  };

  const handleSaveClinic = async () => {
    if (!clinicConfig) return;
    setSaving(true);
    const { error } = await updateClinicConfig({
      ...clinicConfig,
      galleryImages
    });

    if (error) {
      alert(`Failed to save clinic info: ${error}`);
    } else {
      alert('Clinic information saved successfully!');
    }
    setSaving(false);
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    setIsUploading(true);
    const file = e.target.files[0];
    const { data, error } = await uploadToCloudinary(file, 'dr-amir-gallery');
    
    if (error) {
      alert(`Upload failed: ${error}`);
    } else if (data) {
      const updated = [...galleryImages, data];
      setGalleryImages(updated);
      // Auto-save the gallery update
      await updateClinicConfig({ ...clinicConfig, galleryImages: updated } as ClinicConfig);
    }
    setIsUploading(false);
  };

  const handleGalleryDelete = async (index: number) => {
    if (window.confirm('Remove this photo from the gallery?')) {
      const updated = galleryImages.filter((_, i) => i !== index);
      setGalleryImages(updated);
      await updateClinicConfig({ ...clinicConfig, galleryImages: updated } as ClinicConfig);
    }
  };

  const handleProfilePicUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    setIsUploadingProfile(true);
    const file = e.target.files[0];
    const { data, error } = await uploadToCloudinary(file, 'dr-amir-profile');
    
    if (error) {
      alert(`Upload failed: ${error}`);
    } else if (data) {
      setProfileImageUrl(data);
    }
    setIsUploadingProfile(false);
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
    <div className="max-w-5xl space-y-8 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Profile & Clinic Management</h1>
          <p className="text-[var(--color-text-secondary)]">Update doctor's expertise and clinic's information.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Doctor Profile */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6 border-b border-[var(--color-border)] pb-2">
              <h2 className="text-lg font-bold text-[var(--color-text-primary)]">Doctor Profile</h2>
              <Button onClick={handleSave} isLoading={saving} size="sm">
                <Save className="w-4 h-4 mr-2" /> Save Profile
              </Button>
            </div>
            <div className="flex flex-col md:flex-row gap-8 mb-8">
              {/* Profile Pic Upload */}
              <div className="flex-shrink-0 flex flex-col items-center">
                <label className="relative w-32 h-32 rounded-full border-2 border-dashed border-[var(--color-border)] flex items-center justify-center cursor-pointer hover:border-[var(--color-primary)] group overflow-hidden bg-[var(--color-bg)]">
                   <input type="file" className="hidden" accept="image/*" onChange={handleProfilePicUpload} disabled={isUploadingProfile} />
                   {isUploadingProfile ? (
                     <div className="w-8 h-8 rounded-full border-4 border-[var(--color-primary)] border-t-transparent animate-spin" />
                   ) : profileImageUrl ? (
                     <img src={profileImageUrl} alt="Dr Profile" className="w-full h-full object-cover" />
                   ) : (
                     <ImageIcon className="w-8 h-8 text-[var(--color-text-tertiary)]" />
                   )}
                   <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] font-bold">
                     CHANGE PHOTO
                   </div>
                </label>
                <span className="mt-2 text-[10px] text-[var(--color-text-tertiary)] uppercase font-bold tracking-wider">Profile Picture</span>
              </div>

              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input label="Name" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Dr. Amir" />
                <Input label="Title" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. BDS, FCPS — Dental Surgeon" />
              </div>
            </div>
          </Card>

          {/* Education & Experience */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  <div key={i} className="flex gap-2 p-3 bg-[var(--color-bg)] rounded-xl border border-[var(--color-border)]">
                    <div className="flex-1 space-y-2">
                      <Input placeholder="Degree" value={edu.degree || ''} onChange={e => updateItem(setEducation, i, 'degree', e.target.value)} />
                      <div className="flex gap-2">
                        <Input placeholder="Institution" value={edu.institution || ''} onChange={e => updateItem(setEducation, i, 'institution', e.target.value)} className="flex-1" />
                        <Input placeholder="Year" value={edu.year || ''} onChange={e => updateItem(setEducation, i, 'year', e.target.value)} className="w-20" />
                      </div>
                    </div>
                    <Button variant="ghost" className="text-red-500 h-10 px-2" onClick={() => removeItem(setEducation, i)}><Trash2 className="w-4 h-4" /></Button>
                  </div>
                ))}
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
                  <div key={i} className="flex gap-2 p-3 bg-[var(--color-bg)] rounded-xl border border-[var(--color-border)]">
                    <div className="flex-1 space-y-2">
                      <Input placeholder="Role" value={exp.role || ''} onChange={e => updateItem(setExperience, i, 'role', e.target.value)} />
                      <div className="flex gap-2">
                        <Input placeholder="Clinic" value={exp.place || ''} onChange={e => updateItem(setExperience, i, 'place', e.target.value)} className="flex-1" />
                        <Input placeholder="Years" value={exp.duration || ''} onChange={e => updateItem(setExperience, i, 'duration', e.target.value)} className="w-24" />
                      </div>
                    </div>
                    <Button variant="ghost" className="text-red-500 h-10 px-2" onClick={() => removeItem(setExperience, i)}><Trash2 className="w-4 h-4" /></Button>
                  </div>
                ))}
              </div>
            </Card>
          </div>
          
          {/* Clinic Gallery */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-6 border-b border-[var(--color-border)] pb-2">
              <ImageIcon className="w-5 h-5 text-[var(--color-primary)]" />
              <h2 className="text-lg font-bold text-[var(--color-text-primary)]">Clinic Gallery</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {galleryImages.map((url, i) => (
                <div key={i} className="aspect-square bg-[var(--color-bg)] border border-[var(--color-border)] rounded-2xl relative group overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt={`Gallery ${i}`} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-white hover:bg-white/20"
                      onClick={() => handleGalleryDelete(i)}
                    >
                      <Trash2 className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              ))}
              <label className="aspect-square border-2 border-dashed border-[var(--color-border)] rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)]/5 transition-all text-[var(--color-text-secondary)] hover:text-[var(--color-primary)]">
                <input type="file" className="hidden" accept="image/*" onChange={handleGalleryUpload} disabled={isUploading} />
                {isUploading ? (
                  <div className="w-8 h-8 rounded-full border-4 border-[var(--color-primary)] border-t-transparent animate-spin" />
                ) : (
                  <>
                    <Plus className="w-8 h-8 mb-1" />
                    <span className="text-xs font-semibold">Add Photo</span>
                  </>
                )}
              </label>
            </div>
          </Card>
        </div>

        {/* Right Column: Clinic Info */}
        <div className="space-y-8">
          {clinicConfig && (
            <Card className="p-6 sticky top-24">
              <div className="flex items-center justify-between mb-6 border-b border-[var(--color-border)] pb-2">
                <h2 className="text-lg font-bold text-[var(--color-text-primary)] flex items-center gap-2">
                  <Building className="w-5 h-5 text-[var(--color-primary)]" /> Clinic Info
                </h2>
                <Button onClick={handleSaveClinic} isLoading={saving} size="sm">
                  <Save className="w-4 h-4 mr-2" /> Save Info
                </Button>
              </div>
              
              <div className="space-y-4">
                 <Input label="Clinic Name" value={clinicConfig.name} onChange={e => setClinicConfig({...clinicConfig, name: e.target.value})} />
                 <Input label="Clinic Tagline" value={clinicConfig.tagline} onChange={e => setClinicConfig({...clinicConfig, tagline: e.target.value})} />
                 
                 <div className="h-px bg-[var(--color-border)] my-6" />
                 
                 <div className="space-y-3">
                   <div className="flex items-center gap-3 text-sm text-[var(--color-text-secondary)]">
                     <Phone className="w-4 h-4 text-[var(--color-primary)]" />
                     <input 
                       className="bg-transparent border-none focus:ring-0 p-0 flex-1 placeholder:text-[var(--color-text-tertiary)]" 
                       placeholder="Phone Number"
                       value={clinicConfig.phone}
                       onChange={e => setClinicConfig({...clinicConfig, phone: e.target.value})}
                     />
                   </div>
                   <div className="flex items-center gap-3 text-sm text-[var(--color-text-secondary)]">
                     <Mail className="w-4 h-4 text-[var(--color-primary)]" />
                     <input 
                       className="bg-transparent border-none focus:ring-0 p-0 flex-1 placeholder:text-[var(--color-text-tertiary)]" 
                       placeholder="Clinic Email"
                       value={clinicConfig.email}
                       onChange={e => setClinicConfig({...clinicConfig, email: e.target.value})}
                     />
                   </div>
                   <div className="flex items-center gap-3 text-sm text-[var(--color-text-secondary)]">
                     <MapPin className="w-4 h-4 text-[var(--color-primary)]" />
                     <textarea 
                       className="bg-transparent border-none focus:ring-0 p-0 flex-1 placeholder:text-[var(--color-text-tertiary)] resize-none" 
                       placeholder="Physcial Address"
                       rows={2}
                       value={clinicConfig.address}
                       onChange={e => setClinicConfig({...clinicConfig, address: e.target.value})}
                     />
                   </div>
                 </div>

                 <div className="h-px bg-[var(--color-border)] my-6" />

                 <div className="space-y-4">
                   <h3 className="text-sm font-bold text-[var(--color-text-primary)] flex items-center gap-2">
                     <Clock className="w-4 h-4 text-[var(--color-primary)]" /> Opening Hours
                   </h3>
                   <div className="space-y-2 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
                     {Object.entries(clinicConfig.openHours).map(([day, hours]) => (
                       <div key={day} className="flex items-center justify-between text-xs p-2 bg-[var(--color-bg)] rounded-lg border border-[var(--color-border)]">
                         <span className="capitalize font-bold w-12">{day.slice(0,3)}</span>
                         <div className="flex items-center gap-1">
                           <input 
                             className="w-12 bg-transparent border-none p-0 text-center focus:ring-0" 
                             value={(hours as any).open}
                             onChange={e => {
                               const newHours = { ...clinicConfig.openHours };
                               (newHours as any)[day].open = e.target.value;
                               setClinicConfig({ ...clinicConfig, openHours: newHours });
                             }}
                           />
                           <span>-</span>
                           <input 
                             className="w-12 bg-transparent border-none p-0 text-center focus:ring-0" 
                             value={(hours as any).close}
                             onChange={e => {
                               const newHours = { ...clinicConfig.openHours };
                               (newHours as any)[day].close = e.target.value;
                               setClinicConfig({ ...clinicConfig, openHours: newHours });
                             }}
                           />
                         </div>
                         <input 
                           type="checkbox" 
                           checked={(hours as any).isOpen}
                           className="w-3 h-3 rounded text-[var(--color-primary)]"
                           onChange={e => {
                             const newHours = { ...clinicConfig.openHours };
                             (newHours as any)[day].isOpen = e.target.checked;
                             setClinicConfig({ ...clinicConfig, openHours: newHours });
                           }}
                         />
                       </div>
                     ))}
                   </div>
                 </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
