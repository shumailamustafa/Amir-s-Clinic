'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Calendar as CalendarIcon, Link as LinkIcon, Image as ImageIcon } from 'lucide-react';
import { Button, Card, Badge, Modal, Input } from '@dental/ui';
import { 
  subscribeToBlogPosts, 
  createBlogPost, 
  updateBlogPost, 
  deleteBlogPost 
} from '@dental/firebase';
import { uploadToCloudinary } from '@dental/firebase';
import { slugify } from '@dental/utils';
import type { BlogPost } from '@dental/types';

export default function BlogPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  // Fake author since we don't have user profiles right now
  const [author, setAuthor] = useState('Dr. Amir'); 
  const [content, setContent] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');

  useEffect(() => {
    const unsub = subscribeToBlogPosts((data, error) => {
      if (error) {
        console.error('BlogPage sub error:', error);
        return;
      }
      setPosts(data);
    });
    return unsub;
  }, []);

  const handleEdit = (post: BlogPost) => {
    setEditingPost(post);
    setTitle(post.title);
    setCategory(post.category);
    setContent(post.content);
    setImageFile(null);
    setPreviewUrl(post.featuredImageUrl || '');
    setIsModalOpen(true);
  };

  const handleNew = () => {
    setEditingPost(null);
    setTitle('');
    setCategory('');
    setContent('');
    setImageFile(null);
    setPreviewUrl('');
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      const { error } = await deleteBlogPost(id);
      if (error) {
        alert(`Failed to delete post: ${error}`);
      }
    }
  };

  const handleSave = async (status: 'published' | 'draft') => {
    setIsSaving(true);
    let imageUrl = previewUrl;
    
    if (imageFile) {
      const { data, error: uploadError } = await uploadToCloudinary(imageFile, 'dr-amir-blog');
      if (uploadError) {
        alert(`Failed to upload image: ${uploadError}`);
        setIsSaving(false);
        return;
      }
      imageUrl = data || '';
    }

    const postData: Partial<BlogPost> = {
      title,
      slug: slugify(title),
      category,
      content,
      status,
      featuredImageUrl: imageUrl,
      excerpt: content.substring(0, 150) + '...',
      seoTitle: title,
      seoDescription: content.substring(0, 150),
      tags: [category].filter(Boolean)
    };

    let result;
    if (editingPost) {
      result = await updateBlogPost(editingPost.id, postData);
    } else {
      result = await createBlogPost({
        ...postData,
        createdAt: new Date().toISOString(),
        publishedAt: status === 'published' ? new Date().toISOString() : '',
        scheduledAt: '',
      } as Omit<BlogPost, 'id'>);
    }

    if (result.error) {
      alert(`Failed to save post: ${result.error}`);
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
              {posts.map((post) => (
                <tr key={post.id} className="hover:bg-[var(--color-surface)]/50 transition-colors group">
                  <td className="p-4">
                    <p className="font-bold text-[var(--color-text-primary)]">{post.title}</p>
                    <div className="flex items-center gap-1 mt-1 text-xs text-[var(--color-text-tertiary)] hover:text-[var(--color-primary)] cursor-pointer">
                      <LinkIcon className="w-3 h-3" /> /blog/{post.slug}
                    </div>
                  </td>
                  <td className="p-4 text-sm text-[var(--color-text-secondary)]">Dr. Amir</td>
                  <td className="p-4 text-sm text-[var(--color-text-secondary)]">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </td>
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
                      <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-500/10" onClick={() => handleDelete(post.id, post.title)}>
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
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. 5 Tips for Whiter Teeth" 
            className="text-lg font-bold"
          />
          
          <div className="grid grid-cols-2 gap-4">
            <Input label="Category" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="e.g. Dental Hygiene" />
            <Input label="Author" value={author} onChange={(e) => setAuthor(e.target.value)} disabled />
          </div>

          <div>
            <label className="text-sm font-medium text-[var(--color-text-primary)] mb-1.5 flex justify-between">
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
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </div>
          </div>

          <div>
             <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1.5">Featured Image (Cloudinary)</label>
             <label className="border-2 border-dashed border-[var(--color-border)] rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:border-[var(--color-primary)] transition-colors relative overflow-hidden h-32">
               <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
               {previewUrl ? (
                 /* eslint-disable-next-line @next/next/no-img-element */
                 <img src={previewUrl} alt="Preview" className="w-full h-full object-cover absolute" />
               ) : (
                 <>
                   <ImageIcon className="w-8 h-8 text-[var(--color-text-secondary)] mb-2" />
                   <p className="text-sm font-medium text-[var(--color-text-primary)]">Click to upload image</p>
                 </>
               )}
             </label>
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-[var(--color-border)]">
            <Button variant="outline" className="text-red-500 hover:text-red-600 hover:bg-red-50/10 border-red-500/30" onClick={() => setIsModalOpen(false)}>
              <Trash2 className="w-4 h-4 mr-2" /> Discard
            </Button>
            
            <div className="flex gap-3">
              <Button variant="outline" isLoading={isSaving} onClick={() => handleSave('draft')}>Save as Draft</Button>
              <Button className="bg-[var(--color-primary)]" isLoading={isSaving} onClick={() => handleSave('published')}>Publish Post</Button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
