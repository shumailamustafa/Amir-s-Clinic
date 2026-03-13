'use client';

import React, { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, Share2, Star } from 'lucide-react';
import { Button, Card, Badge } from '@dental/ui';
import { subscribeToReviews, updateReviewStatus, addAdminReply } from '@dental/firebase';
import type { Review } from '@dental/types';

export default function ReviewsPage() {
  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [reviews, setReviews] = useState<Review[]>([]);
  const [replyText, setReplyText] = useState<{ [key: string]: string }>({});
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const unsub = subscribeToReviews((data) => setReviews(data));
    return unsub;
  }, []);

  const filtered = reviews.filter(r => r.status === activeTab);

  const handleUpdateStatus = async (id: string, status: 'approved' | 'rejected') => {
    setIsUpdating(true);
    try {
      await updateReviewStatus(id, status);
    } catch (error) {
      console.error('Failed to update review status', error);
      alert('Failed to update status');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleReply = async (id: string) => {
    if (!replyText[id]?.trim()) return;
    setIsUpdating(true);
    try {
      await addAdminReply(id, replyText[id]);
      setReplyText(prev => ({ ...prev, [id]: '' }));
    } catch (error) {
      console.error('Failed to add reply', error);
      alert('Failed to add reply');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Reviews Moderation</h1>
        <p className="text-[var(--color-text-secondary)]">Approve, reject, or reply to patient reviews.</p>
      </div>

      <div className="flex gap-2 border-b border-[var(--color-border)]">
        {(['pending', 'approved', 'rejected'] as const).map((tab) => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors capitalize ${
              activeTab === tab 
                ? 'border-[var(--color-primary)] text-[var(--color-primary)]' 
                : 'border-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
            }`}
          >
            {tab}
            {tab === 'pending' && <span className="ml-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{reviews.filter(r => r.status === 'pending').length}</span>}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filtered.map(review => (
          <Card key={review.id} className="p-6">
            <div className="flex flex-col md:flex-row md:items-start gap-6">
              <div className="md:w-64 shrink-0">
                <p className="font-bold text-[var(--color-text-primary)]">{review.patientName}</p>
                <div className="flex items-center gap-1 my-1 text-[var(--color-star-gold)]">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-current' : 'opacity-30'}`} />
                  ))}
                </div>
                <p className="text-xs text-[var(--color-text-secondary)]">{new Date(review.createdAt).toLocaleDateString()}</p>
                <div className="mt-2">
                  <Badge variant={
                    review.status === 'approved' ? 'success' : 
                    review.status === 'pending' ? 'pending' : 'closed'
                  }>
                    {review.status.toUpperCase()}
                  </Badge>
                </div>
              </div>
              
              <div className="flex-1">
                <p className="text-[var(--color-text-primary)] leading-relaxed bg-[var(--color-surface)] p-4 rounded-xl border border-[var(--color-border)] italic">
                  "{review.reviewText}"
                </p>
                
                {/* Admin Reply Block */}
                {review.status === 'approved' && (
                  <div className="mt-4 pl-4 border-l-2 border-[var(--color-primary)]/30">
                    <p className="text-sm font-semibold text-[var(--color-primary)] mb-1">Clinic Reply:</p>
                    {review.adminReply ? (
                      <p className="text-sm text-[var(--color-text-primary)]">{review.adminReply}</p>
                    ) : (
                      <>
                        <textarea 
                          placeholder="Write a public reply..."
                          value={replyText[review.id] || ''}
                          onChange={(e) => setReplyText({ ...replyText, [review.id]: e.target.value })}
                          className="w-full text-sm bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg px-3 py-2 text-[var(--color-text-primary)] focus:ring-1 focus:ring-[var(--color-primary)] focus:outline-none"
                          rows={2}
                        />
                        <div className="mt-2 flex justify-end">
                          <Button size="sm" onClick={() => handleReply(review.id)} isLoading={isUpdating}>
                            <Share2 className="w-3 h-3 mr-2" /> Post Reply
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>

              {review.status === 'pending' && (
                <div className="flex flex-row md:flex-col gap-2 shrink-0 border-t md:border-t-0 md:border-l border-[var(--color-border)] pt-4 md:pt-0 md:pl-6">
                  <Button 
                    className="flex-1 md:flex-none justify-start bg-[var(--color-status-open)] hover:bg-[var(--color-status-open)]/90 text-white border-0"
                    onClick={() => handleUpdateStatus(review.id, 'approved')}
                    isLoading={isUpdating}
                  >
                    <CheckCircle2 className="w-4 h-4 mr-2" /> Approve
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex-1 md:flex-none justify-start text-red-500 hover:text-red-700 hover:bg-red-50/10 border-red-500/30"
                    onClick={() => handleUpdateStatus(review.id, 'rejected')}
                    isLoading={isUpdating}
                  >
                    <XCircle className="w-4 h-4 mr-2" /> Reject
                  </Button>
                </div>
              )}
            </div>
          </Card>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-12 p-6 bg-[var(--color-surface)] rounded-2xl border border-dashed border-[var(--color-border)]">
            <p className="text-[var(--color-text-secondary)]">No {activeTab} reviews found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
