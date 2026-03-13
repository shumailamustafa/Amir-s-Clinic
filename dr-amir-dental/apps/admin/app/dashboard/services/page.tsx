'use client';

import React, { useState } from 'react';
import { Plus, Edit2, Trash2, GripVertical, Image as ImageIcon } from 'lucide-react';
import { Button, Card, Badge, Modal, Input } from '@dental/ui';

// Placeholder data
const MOCK_SERVICES = [
  { id: '1', name: 'Dental Implants', priceMin: 50000, priceMax: 150000, isVisible: true, order: 1 },
  { id: '2', name: 'Root Canal Treatment', priceMin: 15000, priceMax: 40000, isVisible: true, order: 2 },
  { id: '3', name: 'Teeth Whitening', priceMin: 10000, priceMax: 25000, isVisible: true, order: 3 },
  { id: '4', name: 'Aesthetic Crowns', priceMin: 20000, priceMax: 50000, isVisible: false, order: 4 },
];

export default function ServicesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<any>(null);

  const handleEdit = (service: any) => {
    setEditingService(service);
    setIsModalOpen(true);
  };

  const handleNew = () => {
    setEditingService(null);
    setIsModalOpen(true);
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
            {MOCK_SERVICES.map((service) => (
              <tr key={service.id} className="hover:bg-[var(--color-surface)]/50 transition-colors group">
                <td className="p-4 text-center cursor-grab active:cursor-grabbing text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)]">
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
                    <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-500/10">
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
            defaultValue={editingService?.name} 
            placeholder="e.g. Dental Implants" 
          />
          
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1.5">Description</label>
            <textarea 
              className="w-full px-4 py-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] resize-y min-h-[100px]"
              placeholder="Short description for the card..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input label="Minimum Price (Rs)" type="number" defaultValue={editingService?.priceMin} />
            <Input label="Maximum Price (Rs)" type="number" defaultValue={editingService?.priceMax} />
          </div>

          <Input label="Estimated Duration" placeholder="e.g. 30-45 minutes" />
          
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1.5">Icon / Image (Cloudinary)</label>
            <div className="border-2 border-dashed border-[var(--color-border)] rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:border-[var(--color-primary)] transition-colors">
              <ImageIcon className="w-8 h-8 text-[var(--color-text-secondary)] mb-2" />
              <p className="text-sm font-medium text-[var(--color-text-primary)]">Click to upload image</p>
              <p className="text-xs text-[var(--color-text-secondary)]">JPG, PNG up to 2MB</p>
            </div>
          </div>

          <label className="flex items-center gap-3 cursor-pointer py-2">
            <input 
              type="checkbox" 
              defaultChecked={editingService ? editingService.isVisible : true}
              className="w-5 h-5 accent-[var(--color-primary)] rounded border-[var(--color-border)]"
            />
            <span className="font-medium text-[var(--color-text-primary)]">Visible on Website</span>
          </label>

          <div className="flex justify-end gap-3 pt-4 border-t border-[var(--color-border)]">
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button onClick={() => setIsModalOpen(false)}>Save Service</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
