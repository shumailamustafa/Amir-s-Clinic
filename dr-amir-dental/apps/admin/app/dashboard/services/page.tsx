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
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [priceMin, setPriceMin] = useState(0);
  const [priceMax, setPriceMax] = useState(0);
  const [duration, setDuration] = useState('');
  const [isVisible, setIsVisible] = useState(true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');

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
    setImageFile(null);
    setPreviewUrl(service.imageUrl || '');
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
    setImageFile(null);
    setPreviewUrl('');
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
    let imageUrl = previewUrl; // Use existing if no file uploaded
    
    if (imageFile) {
      const { data, error: uploadError } = await uploadToCloudinary(imageFile, 'dr-amir-services');
      if (uploadError) {
        alert(`Failed to upload image: ${uploadError}`);
        setIsSaving(false);
        return;
      }
      imageUrl = data || '';
    }

    let result;
    if (editingService) {
      result = await updateService(editingService.id, {
        name, description, priceMin, priceMax, estimatedTime: duration, isVisible, imageUrl
      });
    } else {
      result = await createService({
        name, description, priceMin, priceMax, estimatedTime: duration, isVisible,
        procedureSteps: [],
        imageUrl,
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
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
      // Ideally revert state here, but for brevity keep it
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
          
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1.5">Icon / Image (Cloudinary)</label>
            <label className="border-2 border-dashed border-[var(--color-border)] rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:border-[var(--color-primary)] transition-colors relative overflow-hidden h-32">
              <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
              {previewUrl ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={previewUrl} alt="Preview" className="w-full h-full object-contain absolute" />
              ) : (
                <>
                  <ImageIcon className="w-8 h-8 text-[var(--color-text-secondary)] mb-2" />
                  <p className="text-sm font-medium text-[var(--color-text-primary)]">Click to upload image</p>
                  <p className="text-xs text-[var(--color-text-secondary)]">JPG, PNG up to 2MB</p>
                </>
              )}
            </label>
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
