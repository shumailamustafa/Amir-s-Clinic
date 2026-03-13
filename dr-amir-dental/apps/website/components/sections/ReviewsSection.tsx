'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, MessageSquarePlus, Send, ChevronLeft, ChevronRight, User } from 'lucide-react';
import { Button, Input } from '@dental/ui';
import { FloatingTeeth } from '../ui/FloatingTeeth';
import { StarRating } from '../ui/StarRating';

// Placeholder reviews — will come from Firestore
const reviewsData = [
  { id: '1', name: 'Ahmed Khan', rating: 5, text: 'Excellent experience! Dr. Amir is extremely professional. My dental implant procedure was painless and the results are amazing. Highly recommended!', date: '2024-02-15', avatarLetter: 'A' },
  { id: '2', name: 'Fatima Ali', rating: 5, text: 'Best dentist in Lahore. The clinic is very clean and modern. My teeth whitening turned out beautifully!', date: '2024-02-10', avatarLetter: 'F' },
  { id: '3', name: 'Muhammad Usman', rating: 4, text: 'Very professional service. The root canal treatment was smooth and painless. Thank you Dr. Amir!', date: '2024-01-28', avatarLetter: 'M' },
  { id: '4', name: 'Ayesha Siddiqui', rating: 5, text: 'Amazing experience with orthodontics. The entire team is very friendly and caring. Will definitely come back.', date: '2024-01-20', avatarLetter: 'A' },
  { id: '5', name: 'Bilal Hassan', rating: 5, text: 'Had scaling done here. Quick, professional, and affordable. The clinic has top-notch equipment.', date: '2024-01-15', avatarLetter: 'B' },
  { id: '6', name: 'Sana Malik', rating: 4, text: 'My crown looks completely natural. Dr. Amir really takes the time to ensure everything is perfect.', date: '2024-01-10', avatarLetter: 'S' },
];

const statsData = { totalReviews: 180, averageRating: 4.8, fiveStarCount: 156 };

function AnimatedCounter({ target, duration = 2000 }: { target: number; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const startTime = performance.now();

          const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * target));
            if (progress < 1) requestAnimationFrame(animate);
          };

          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);

  return <span ref={ref}>{count.toLocaleString()}</span>;
}

export function ReviewsSection() {
  const [showForm, setShowForm] = useState(false);
  const [reviewerName, setReviewerName] = useState('');
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [scrollIndex, setScrollIndex] = useState(0);

  const visibleCount = 3;
  const maxIndex = Math.max(0, reviewsData.length - visibleCount);

  const handleSubmitReview = () => {
    // Will integrate with Firebase later
    setShowForm(false);
    setReviewerName('');
    setReviewRating(0);
    setReviewText('');
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
              <AnimatedCounter target={48} /><span className="text-lg">/50</span>
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

        {/* Reviews Carousel */}
        <div className="relative mb-12">
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
                {reviewsData.map((review, index) => (
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
                    label="Your Name"
                    placeholder="Enter your name"
                    value={reviewerName}
                    onChange={(e) => setReviewerName(e.target.value)}
                    icon={<User className="w-4 h-4" />}
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
                    disabled={!reviewerName || !reviewRating || !reviewText}
                  >
                    <Send className="w-4 h-4 mr-2" /> Submit Review
                  </Button>
                </div>
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </div>
    </section>
  );
}
