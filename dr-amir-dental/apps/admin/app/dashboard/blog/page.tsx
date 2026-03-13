'use client';

import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Calendar as CalendarIcon, Link as LinkIcon } from 'lucide-react';
import { Button, Card, Badge, Modal, Input } from '@dental/ui';

const MOCK_POSTS = [
  { id: '1', title: 'Why Regular Dental Checkups Matter', slug: 'why-regular-dental-checkups-matter', status: 'published', author: 'Dr. Amir', date: '2024-03-10' },
  { id: '2', title: '5 Tips for Whiter Teeth at Home', slug: '5-tips-for-whiter-teeth-at-home', status: 'published', author: 'Dr. Amir', date: '2024-03-05' },
  { id: '3', title: 'Understanding Root Canals', slug: 'understanding-root-canals', status: 'draft', author: 'Staff Writer', date: '2024-03-15' },
];

export default function BlogPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<any>(null);

  const handleEdit = (post: any) => {
    setEditingPost(post);
    setIsModalOpen(true);
  };

  const handleNew = () => {
    setEditingPost(null);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Blog Articles</h1>
          <p className="text-[var(--color-text-secondary)]">Manage posts for the clinic blog.</p>
        </div>
        <Button onClick={handleNew}>
          <Plus className="w-4 h-4 mr-2" /> Write New Post
        </Button>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[var(--color-surface)] border-b border-[var(--color-border)] text-[var(--color-text-secondary)] text-sm">
                <th className="p-4 font-medium">Post Title</th>
                <th className="p-4 font-medium">Author</th>
                <th className="p-4 font-medium">Date</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {MOCK_POSTS.map((post) => (
                <tr key={post.id} className="hover:bg-[var(--color-surface)]/50 transition-colors group">
                  <td className="p-4">
                    <p className="font-bold text-[var(--color-text-primary)]">{post.title}</p>
                    <div className="flex items-center gap-1 mt-1 text-xs text-[var(--color-text-tertiary)] hover:text-[var(--color-primary)] cursor-pointer">
                      <LinkIcon className="w-3 h-3" /> /blog/{post.slug}
                    </div>
                  </td>
                  <td className="p-4 text-sm text-[var(--color-text-secondary)]">{post.author}</td>
                  <td className="p-4 text-sm text-[var(--color-text-secondary)]">{post.date}</td>
                  <td className="p-4">
                    <Badge variant={post.status === 'published' ? 'success' : 'pending'}>
                      {post.status.toUpperCase()}
                    </Badge>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(post)}>
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
        </div>
      </Card>

      {/* Editor Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={editingPost ? "Edit Post" : "Compose New Post"}
        size="lg" // Would normally be fullscreen for a real rich editor
      >
        <div className="space-y-4">
          <Input 
            label="Post Title" 
            defaultValue={editingPost?.title} 
            placeholder="e.g. 5 Tips for Whiter Teeth" 
            className="text-lg font-bold"
          />
          
          <div className="grid grid-cols-2 gap-4">
            <Input label="Category" placeholder="e.g. Dental Hygiene" />
            <Input label="Author" defaultValue={editingPost?.author || "Dr. Amir"} />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1.5 flex justify-between">
              Content
              <span className="text-[var(--color-primary)] text-xs flex items-center gap-1">
                TipTap Editor Placeholder <Edit2 className="w-3 h-3"/>
              </span>
            </label>
            <div className="border border-[var(--color-border)] rounded-lg overflow-hidden flex flex-col">
              {/* Fake Toolbar */}
              <div className="bg-[var(--color-surface)] border-b border-[var(--color-border)] p-2 flex gap-2">
                <Button variant="ghost" size="sm" className="w-8 h-8 p-0 font-bold">B</Button>
                <Button variant="ghost" size="sm" className="w-8 h-8 p-0 italic">I</Button>
                <Button variant="ghost" size="sm" className="w-8 h-8 p-0 underline">U</Button>
                <div className="w-px h-6 bg-[var(--color-border)] mx-1 self-center" />
                <Button variant="ghost" size="sm" className="w-8 h-8 p-0"><LinkIcon className="w-4 h-4" /></Button>
              </div>
              {/* Fake Editor Area */}
              <textarea 
                className="w-full p-4 bg-[var(--color-bg)] focus:outline-none resize-y min-h-[200px] text-[var(--color-text-primary)] border-none"
                placeholder="Start writing..."
                defaultValue="This is a placeholder for the TipTap rich text editor. In Phase 5 integration, this will be replaced with a real TipTap instance supporting bold, italic, headings, lists, and image uploads."
              />
            </div>
          </div>

          <div>
             <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1.5">Featured Image (Cloudinary)</label>
             <div className="border-2 border-dashed border-[var(--color-border)] rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:border-[var(--color-primary)] transition-colors bg-[var(--color-surface)]">
               <span className="text-sm font-medium">Upload Image</span>
             </div>
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-[var(--color-border)]">
            <Button variant="outline" className="text-red-500 hover:text-red-600 hover:bg-red-50/10 border-red-500/30">
              <Trash2 className="w-4 h-4 mr-2" /> Discard
            </Button>
            
            <div className="flex gap-3">
              <Button variant="outline">Save as Draft</Button>
              <Button className="bg-[var(--color-primary)]">Publish Post</Button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
