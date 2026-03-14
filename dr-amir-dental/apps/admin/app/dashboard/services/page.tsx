'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, GripVertical, Image as ImageIcon } from 'lucide-react';
import { Button, Card, Badge, Modal, Input } from '@dental/ui';
import {
  subscribeToServices,
  createService,
  updateService,
  deleteService,
  reorderServices
} from '@dental/firebase';
import { uploadToCloudinary } from '@dental/firebase';
import type { Service } from '@dental/types';

export default function ServicesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  // Form State
  // Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [priceMin, setPriceMin] = useState(0);
  const [priceMax, setPriceMax] = useState(0);
  const [duration, setDuration] = useState('');
  const [isVisible, setIsVisible] = useState(true);
  const [procedureSteps, setProcedureSteps] = useState<string[]>([]);
  const [selectedIcon, setSelectedIcon] = useState<string>('Shield');
  const [beforeAfterImages, setBeforeAfterImages] = useState<{ before: string; after: string }[]>([]);
  const [isUploadingBA, setIsUploadingBA] = useState<number | null>(null);

  // Drag and Drop State
  const [draggedId, setDraggedId] = useState<string | null>(null);

  useEffect(() => {
    const unsub = subscribeToServices((data, error) => {
      if (error) {
        console.error('ServicesPage sub error:', error);
        return;
      }
      setServices(data);
    });
    return unsub;
  }, []);

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setName(service.name);
    setDescription(service.description);
    setPriceMin(service.priceMin);
    setPriceMax(service.priceMax);
    setDuration(service.estimatedTime);
    setIsVisible(service.isVisible);
    setProcedureSteps(service.procedureSteps || []);
    setSelectedIcon(service.iconName || 'Shield');
    setBeforeAfterImages(service.beforeAfterImages || []);
    setIsModalOpen(true);
  };

  const handleNew = () => {
    setEditingService(null);
    setName('');
    setDescription('');
    setPriceMin(0);
    setPriceMax(0);
    setDuration('');
    setIsVisible(true);
    setProcedureSteps([]);
    setSelectedIcon('Shield');
    setBeforeAfterImages([]);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      const { error } = await deleteService(id);
      if (error) {
        alert(`Failed to delete service: ${error}`);
      }
    }
  };

  const handleSave = async () => {
    setIsSaving(true);

    let result;
    if (editingService) {
      result = await updateService(editingService.id, {
        name,
        description,
        priceMin,
        priceMax,
        estimatedTime: duration,
        isVisible,
        procedureSteps,
        iconName: selectedIcon,
        beforeAfterImages
      });
    } else {
      result = await createService({
        name,
        description,
        priceMin,
        priceMax,
        estimatedTime: duration,
        isVisible,
        procedureSteps,
        iconName: selectedIcon,
        imageUrl: '',
        beforeAfterImages: [],
        order: services.length,
        createdAt: new Date().toISOString()
      } as Omit<Service, 'id'>);
    }

    if (result.error) {
      alert(`Failed to save service: ${result.error}`);
    } else {
      setIsModalOpen(false);
    }
    setIsSaving(false);
  };

  const handleBAUpload = async (e: React.ChangeEvent<HTMLInputElement>, index: number, side: 'before' | 'after') => {
    if (e.target.files && e.target.files[0]) {
      setIsUploadingBA(index);
      const { data, error } = await uploadToCloudinary(e.target.files[0], 'dr-amir-ba');
      if (data) {
        const updated = [...beforeAfterImages];
        updated[index] = { ...updated[index], [side]: data };
        setBeforeAfterImages(updated);
      }
      setIsUploadingBA(null);
    }
  };

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedId(id);
    e.dataTransfer.effectAllowed = 'move';
    e.currentTarget.classList.add('opacity-50');
  };

  const handleDragEnd = (e: React.DragEvent) => {
    setDraggedId(null);
    e.currentTarget.classList.remove('opacity-50');
  };

  const handleDragOver = (e: React.DragEvent, id: string) => {
    e.preventDefault();
    if (draggedId === id) return;
  };

  const handleDrop = async (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (!draggedId || draggedId === targetId) return;

    const list = [...services];
    const draggedIdx = list.findIndex(s => s.id === draggedId);
    const targetIdx = list.findIndex(s => s.id === targetId);

    const [draggedItem] = list.splice(draggedIdx, 1);
    list.splice(targetIdx, 0, draggedItem);

    // Immediately fix local state so it looks fast
    setServices(list);

    // Persist to firestore
    const orderedIds = list.map(s => s.id);
    const { error } = await reorderServices(orderedIds);
    if (error) {
      alert(`Failed to save new order: ${error}`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Services</h1>
          <p className="text-[var(--color-text-secondary)]">Manage treatments, prices, and display order.</p>
        </div>

        <Button onClick={handleNew}>
          <Plus className="w-4 h-4 mr-2" /> Add New Service
        </Button>
      </div>

      <Card className="overflow-hidden">
        <div className="p-4 bg-[var(--color-surface)] border-b border-[var(--color-border)] flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
          <GripVertical className="w-4 h-4" /> Drag rows to reorder how they appear on the website
        </div>

        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[var(--color-border)] text-[var(--color-text-secondary)] text-sm">
              <th className="p-4 w-12 text-center"></th>
              <th className="p-4 font-medium">Service Name</th>
              <th className="p-4 font-medium">Price Range (Rs)</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-border)]">
            {services.map((service) => (
              <tr
                key={service.id}
                className="hover:bg-[var(--color-surface)]/50 transition-colors group cursor-grab active:cursor-grabbing"
                draggable
                onDragStart={(e) => handleDragStart(e, service.id)}
                onDragEnd={handleDragEnd}
                onDragOver={(e) => handleDragOver(e, service.id)}
                onDrop={(e) => handleDrop(e, service.id)}
              >
                <td className="p-4 text-center text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)]">
                  <GripVertical className="w-5 h-5 mx-auto" />
                </td>
                <td className="p-4 font-medium text-[var(--color-text-primary)]">{service.name}</td>
                <td className="p-4 text-sm text-[var(--color-text-secondary)]">
                  {service.priceMin.toLocaleString()} - {service.priceMax.toLocaleString()}
                </td>
                <td className="p-4">
                  <Badge variant={service.isVisible ? 'open' : 'closed'}>
                    {service.isVisible ? 'Visible' : 'Hidden'}
                  </Badge>
                </td>
                <td className="p-4 text-right">
                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(service)}>
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-500/10" onClick={() => handleDelete(service.id, service.name)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {/* Edit/Create Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingService ? "Edit Service" : "Add New Service"}
        size="lg"
      >
        <div className="space-y-4">
          <Input
            label="Service Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Dental Implants"
          />

          <div>
            <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1.5">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] resize-y min-h-[100px]"
              placeholder="Short description for the card..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input label="Minimum Price (Rs)" type="number" value={priceMin} onChange={(e) => setPriceMin(Number(e.target.value))} />
            <Input label="Maximum Price (Rs)" type="number" value={priceMax} onChange={(e) => setPriceMax(Number(e.target.value))} />
          </div>

          <Input label="Estimated Duration" value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="e.g. 30-45 minutes" />

          {/* Icon Selector */}
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">Category Icon</label>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
              {['Shield', 'Heart', 'Smile', 'Sparkles', 'Stethoscope', 'Syringe', 'Eye', 'Crown', 'Baby', 'Star', 'Activity', 'Award'].map((iconName) => {
                const Icon = require('lucide-react')[iconName] || require('lucide-react').Shield;
                return (
                  <button
                    key={iconName}
                    title={iconName}
                    onClick={() => setSelectedIcon(iconName)}
                    className={`p-3 rounded-xl border flex items-center justify-center transition-all ${selectedIcon === iconName
                        ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/10 text-[var(--color-primary)] shadow-sm'
                        : 'border-[var(--color-border)] hover:border-[var(--color-text-tertiary)] text-[var(--color-text-tertiary)]'
                      }`}
                  >
                    <Icon className="w-5 h-5" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Procedure Steps */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-[var(--color-text-primary)]">Procedure Steps</label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setProcedureSteps([...procedureSteps, ''])}
              >
                <Plus className="w-3 h-3 mr-1" /> Add Step
              </Button>
            </div>
            <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
              {procedureSteps.map((step, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder={`Step ${index + 1}`}
                    value={step}
                    onChange={(e) => {
                      const newSteps = [...procedureSteps];
                      newSteps[index] = e.target.value;
                      setProcedureSteps(newSteps);
                    }}
                    className="flex-1"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-500 h-10 px-2"
                    onClick={() => setProcedureSteps(procedureSteps.filter((_, i) => i !== index))}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              {procedureSteps.length === 0 && (
                <p className="text-xs text-[var(--color-text-tertiary)] text-center py-4 bg-[var(--color-surface)] rounded-xl border border-dashed border-[var(--color-border)]">
                  No steps added yet. Click "Add Step" to begin.
                </p>
              )}
            </div>
          </div>


          {/* Before/After Gallery */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-[var(--color-text-primary)]">Transformation Gallery (Before/After)</label>
              <Button variant="ghost" size="sm" onClick={() => setBeforeAfterImages([...beforeAfterImages, { before: '', after: '' }])}>
                <Plus className="w-3 h-3 mr-1" /> Add Result
              </Button>
            </div>
            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
              {beforeAfterImages.map((ba, index) => (
                <div key={index} className="flex gap-4 p-4 bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] group relative">
                  <div className="flex-1 grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-[var(--color-text-tertiary)] uppercase">Before</span>
                      <label className="aspect-square border border-[var(--color-border)] rounded-lg flex items-center justify-center cursor-pointer hover:bg-white/10 transition-colors relative overflow-hidden">
                        <input type="file" className="hidden" accept="image/*" onChange={(e) => handleBAUpload(e, index, 'before')} />
                        {ba.before ? (
                          <img src={ba.before} className="w-full h-full object-cover absolute" alt="Before" />
                        ) : (
                          <Plus className="w-4 h-4 text-[var(--color-text-tertiary)]" />
                        )}
                      </label>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-[var(--color-text-tertiary)] uppercase">After</span>
                      <label className="aspect-square border border-[var(--color-border)] rounded-lg flex items-center justify-center cursor-pointer hover:bg-white/10 transition-colors relative overflow-hidden">
                        <input type="file" className="hidden" accept="image/*" onChange={(e) => handleBAUpload(e, index, 'after')} />
                        {ba.after ? (
                          <img src={ba.after} className="w-full h-full object-cover absolute" alt="After" />
                        ) : (
                          <Plus className="w-4 h-4 text-[var(--color-text-tertiary)]" />
                        )}
                      </label>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-500 absolute -top-2 -right-2 bg-white shadow-sm border border-red-100 rounded-full w-6 h-6 p-0 opacity-0 group-hover:opacity-100"
                    onClick={() => setBeforeAfterImages(beforeAfterImages.filter((_, i) => i !== index))}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              ))}
              {beforeAfterImages.length === 0 && (
                <div className="text-center py-6 border-2 border-dashed border-[var(--color-border)] rounded-xl text-[var(--color-text-tertiary)] text-xs">
                  No transformation photos yet. High-quality before/after photos increase patient trust!
                </div>
              )}
            </div>
          </div>

          <label className="flex items-center gap-3 cursor-pointer py-2">
            <input
              type="checkbox"
              checked={isVisible}
              onChange={(e) => setIsVisible(e.target.checked)}
              className="w-5 h-5 accent-[var(--color-primary)] rounded border-[var(--color-border)]"
            />
            <span className="font-medium text-[var(--color-text-primary)]">Visible on Website</span>
          </label>

          <div className="flex justify-end gap-3 pt-4 border-t border-[var(--color-border)]">
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} isLoading={isSaving}>Save Service</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
