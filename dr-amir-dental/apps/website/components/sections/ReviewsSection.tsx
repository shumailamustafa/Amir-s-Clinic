'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, MessageSquarePlus, Send, ChevronLeft, ChevronRight, User, Phone, CheckCircle } from 'lucide-react';
import { Button, Input } from '@dental/ui';
import { FloatingTeeth } from '../ui/FloatingTeeth';
import { StarRating } from '../ui/StarRating';
import { useReviews } from '../../hooks/useReviews';

// Hardcoded stats defaults — will be recalculated from real data
const statsDataDefaults = { totalReviews: 0, averageRating: 0, fiveStarCount: 0 };

function AnimatedCounter({ target, duration = 1500 }: { target: number; duration?: number }) {
  const [count, setCount] = useState(0);
  const prevTargetRef = useRef(0);

  useEffect(() => {
    const startValue = count;
    const endValue = target;
    
    if (startValue === endValue) return;

    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      
      const currentCount = Math.floor(startValue + eased * (endValue - startValue));
      setCount(currentCount);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
    prevTargetRef.current = target;
  }, [target, duration]);

  return <span>{count.toLocaleString()}</span>;
}

export function ReviewsSection() {
  const [showForm, setShowForm] = useState(false);
  const [reviewerName, setReviewerName] = useState('');
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [scrollIndex, setScrollIndex] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const { reviews, loading } = useReviews(true);

  // Recalculate stats based on real reviews
  const statsData = React.useMemo(() => {
    if (reviews.length === 0) return statsDataDefaults;
    const total = reviews.length;
    const avg = reviews.reduce((acc, r) => acc + r.rating, 0) / total;
    const fiveStars = reviews.filter(r => r.rating === 5).length;
    return {
      totalReviews: total,
      averageRating: Math.round(avg * 10) / 10,
      fiveStarCount: fiveStars
    };
  }, [reviews]);

  const displayReviews = reviews.map(r => ({
    id: r.id,
    name: r.patientName,
    rating: r.rating,
    text: r.reviewText,
    date: r.createdAt,
    avatarLetter: r.patientName.charAt(0).toUpperCase()
  }));

const visibleCount = 3;
  const maxIndex = Math.max(0, displayReviews.length - visibleCount);

  const handleSubmitReview = async () => {
    if (!reviewerName || !reviewRating || !reviewText) return;
    
    setIsSubmitting(true);
    try {
      const { createReview } = await import('@dental/firebase');
      const { error } = await createReview({
        patientName: reviewerName,
        phone: patientPhone,
        rating: reviewRating,
        reviewText,
        referenceNumber: `REV-${Date.now().toString(36).toUpperCase()}`,
        status: 'pending',
        adminReply: '',
        createdAt: new Date().toISOString(),
      });

      if (error) {
        alert(`Failed to submit review: ${error}`);
      } else {
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 1000); // Show for exactly 1 second as requested
        setShowForm(false);
        setReviewerName('');
        setPatientPhone('');
        setReviewRating(0);
        setReviewText('');
      }
    } catch (err) {
      console.error('Error submitting review:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="reviews" className="relative py-20 bg-[var(--color-surface)] overflow-hidden">
      <FloatingTeeth variant={4} />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-[var(--color-text-primary)] mb-4">
            Patient Reviews
          </h2>
          <p className="text-[var(--color-text-secondary)] max-w-xl mx-auto">
            See what our patients say about their experience
          </p>
        </motion.div>

        {/* Stats Row — Animated Counters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-3 gap-6 max-w-xl mx-auto mb-16"
        >
          <div className="text-center">
            <div className="text-3xl font-bold text-[var(--color-primary)]">
              <AnimatedCounter target={statsData.totalReviews} />+
            </div>
            <p className="text-sm text-[var(--color-text-secondary)]">Total Reviews</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-[var(--color-star-gold)]">
              {statsData.averageRating}<span className="text-lg">/5</span>
            </div>
            <p className="text-sm text-[var(--color-text-secondary)]">Avg Rating</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-[var(--color-status-open)]">
              <AnimatedCounter target={statsData.fiveStarCount} />
            </div>
            <p className="text-sm text-[var(--color-text-secondary)]">5-Star Reviews</p>
          </div>
        </motion.div>

        <div className="relative mb-12 min-h-[220px]">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-[var(--color-bg)] rounded-2xl p-6 border border-[var(--color-border)] animate-pulse">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-[var(--color-surface)]" />
                    <div className="space-y-2">
                      <div className="h-4 w-24 bg-[var(--color-surface)] rounded" />
                      <div className="h-3 w-16 bg-[var(--color-surface)] rounded" />
                    </div>
                  </div>
                  <div className="h-4 w-full bg-[var(--color-surface)] rounded mb-2" />
                  <div className="h-4 w-2/3 bg-[var(--color-surface)] rounded" />
                </div>
              ))}
            </div>
          ) : displayReviews.length > 0 ? (
            <div className="flex items-center gap-4">
              <button
                onClick={() => setScrollIndex(Math.max(0, scrollIndex - 1))}
                disabled={scrollIndex === 0}
                className="shrink-0 p-2 rounded-full bg-[var(--color-bg)] border border-[var(--color-border)] hover:bg-[var(--color-primary)]/10 disabled:opacity-30 transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5 text-[var(--color-text-primary)]" />
              </button>

              <div className="flex-1 overflow-hidden">
                <motion.div
                  className="flex gap-6"
                  animate={{ x: `-${scrollIndex * (100 / visibleCount + 2)}%` }}
                  transition={{ type: 'spring', stiffness: 200, damping: 30 }}
                >
                  {displayReviews.map((review, index) => (
                    <motion.div
                      key={review.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="shrink-0 w-full md:w-[calc(33.333%-1rem)] bg-[var(--color-bg)] rounded-2xl p-6 border border-[var(--color-border)] shadow-[var(--shadow-card)]"
                    >
                      {/* Reviewer */}
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center text-[var(--color-primary)] font-bold text-sm">
                          {review.avatarLetter}
                        </div>
                        <div>
                          <p className="font-semibold text-[var(--color-text-primary)] text-sm">{review.name}</p>
                          <p className="text-xs text-[var(--color-text-secondary)]">{new Date(review.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                        </div>
                      </div>

                      {/* Stars */}
                      <StarRating rating={review.rating} size="sm" />

                      {/* Text */}
                      <p className="mt-3 text-sm text-[var(--color-text-secondary)] leading-relaxed line-clamp-4">
                        {review.text}
                      </p>
                    </motion.div>
                  ))}
                </motion.div>
              </div>

              <button
                onClick={() => setScrollIndex(Math.min(maxIndex, scrollIndex + 1))}
                disabled={scrollIndex >= maxIndex}
                className="shrink-0 p-2 rounded-full bg-[var(--color-bg)] border border-[var(--color-border)] hover:bg-[var(--color-primary)]/10 disabled:opacity-30 transition-colors cursor-pointer"
              >
                <ChevronRight className="w-5 h-5 text-[var(--color-text-primary)]" />
              </button>
            </div>
          ) : (
            <div className="text-center py-12 bg-[var(--color-bg)] rounded-3xl border border-dashed border-[var(--color-border)]">
              <Star className="w-12 h-12 text-[var(--color-text-secondary)]/20 mx-auto mb-4" />
              <p className="text-[var(--color-text-secondary)]">No approved reviews yet.</p>
              <p className="text-sm text-[var(--color-text-secondary)]/60">Be the first to share your experience!</p>
            </div>
          )}
        </div>

        {/* Write Review Button + Form */}
        <div className="text-center">
          {!showForm ? (
            <Button
              variant="outline"
              onClick={() => setShowForm(true)}
            >
              <MessageSquarePlus className="w-4 h-4 mr-2" />
              Write a Review
            </Button>
          ) : (
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="max-w-lg mx-auto bg-[var(--color-bg)] rounded-2xl p-6 border border-[var(--color-border)] shadow-[var(--shadow-card)] text-left"
              >
                <h4 className="text-lg font-bold text-[var(--color-text-primary)] mb-4">Share Your Experience</h4>

                <div className="space-y-4">
                  <Input
                    label="Full Name"
                    placeholder="Enter your name"
                    value={reviewerName}
                    onChange={(e) => setReviewerName(e.target.value)}
                    icon={<User className="w-4 h-4" />}
                  />

                  <Input
                    label="Phone Number"
                    placeholder="0300-1234567"
                    value={patientPhone}
                    onChange={(e) => setPatientPhone(e.target.value)}
                    icon={<Phone className="w-4 h-4" />}
                  />

                  <div>
                    <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">Rating</label>
                    <StarRating rating={reviewRating} interactive size="lg" onRate={setReviewRating} />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1.5">Your Review</label>
                    <textarea
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      rows={4}
                      placeholder="Tell us about your experience..."
                      className="w-full px-4 py-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] resize-none"
                    />
                  </div>
                </div>

                <div className="flex gap-3 mt-4">
                  <Button variant="ghost" onClick={() => setShowForm(false)}>Cancel</Button>
                   <Button
                    onClick={handleSubmitReview}
                    disabled={!reviewerName || !patientPhone || !reviewRating || !reviewText || isSubmitting}
                    isLoading={isSubmitting}
                  >
                    <Send className="w-4 h-4 mr-2" /> Submit Review
                  </Button>
                </div>
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </div>

      {/* Success Notification */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 100, x: '-50%', scale: 0.8 }}
            animate={{ opacity: 1, y: 0, x: '-50%', scale: 1 }}
            exit={{ opacity: 0, y: 20, x: '-50%', scale: 0.9 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="fixed bottom-12 left-1/2 z-[100] bg-[var(--color-bg)] border-2 border-[var(--color-status-open)]/40 rounded-3xl p-5 shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex items-center gap-5 min-w-[340px] backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.1, type: 'spring', damping: 12 }}
              className="w-12 h-12 rounded-2xl bg-[var(--color-status-open)]/20 flex items-center justify-center shadow-inner"
            >
              <CheckCircle className="w-7 h-7 text-[var(--color-status-open)]" />
            </motion.div>
            <div>
              <p className="font-extrabold text-[var(--color-text-primary)] text-lg tracking-tight">Review Submitted!</p>
              <p className="text-sm text-[var(--color-text-secondary)] font-medium">Thank you for your valuable feedback.</p>
            </div>
            
            {/* Subtle pulse background */}
            <motion.div 
              className="absolute inset-0 rounded-3xl bg-[var(--color-status-open)]/5 -z-10"
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
