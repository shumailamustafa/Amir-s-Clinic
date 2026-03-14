'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Clock, Tag, ChevronRight, Search, X } from 'lucide-react';
import { FloatingTeeth } from '../ui/FloatingTeeth';

// Placeholder blog posts — will come from Firestore
const blogData = [
  {
    id: '1',
    title: 'The Complete Guide to Dental Implants: What You Need to Know',
    excerpt: 'Dental implants are a revolutionary solution for missing teeth. Learn everything about the procedure, recovery, and long-term benefits.',
    category: 'Dental Care',
    readingTime: '5 min read',
    date: '2024-02-20',
    imageUrl: '',
    slug: 'complete-guide-dental-implants',
  },
  {
    id: '2',
    title: '5 Tips for Maintaining Perfect Oral Hygiene at Home',
    excerpt: 'Discover the best practices for keeping your teeth and gums healthy between dental visits. Expert tips from Dr. Amir.',
    category: 'Oral Health',
    readingTime: '3 min read',
    date: '2024-02-15',
    imageUrl: '',
    slug: 'tips-oral-hygiene-home',
  },
  {
    id: '3',
    title: 'Understanding Root Canal Treatment: Myths vs Facts',
    excerpt: 'Root canal treatment has a bad reputation, but modern techniques have made it virtually painless. Let\'s separate facts from fiction.',
    category: 'Dental Care',
    readingTime: '4 min read',
    date: '2024-02-10',
    imageUrl: '',
    slug: 'root-canal-myths-facts',
  },
  {
    id: '4',
    title: 'How Teeth Whitening Can Boost Your Confidence',
    excerpt: 'A brighter smile can transform your appearance and self-esteem. Explore professional whitening options and results.',
    category: 'Cosmetic',
    readingTime: '3 min read',
    date: '2024-02-05',
    imageUrl: '',
    slug: 'teeth-whitening-confidence',
  },
  {
    id: '5',
    title: 'When Should Your Child First Visit the Dentist?',
    excerpt: 'Early dental visits set the foundation for a lifetime of healthy teeth. Find out the ideal age and what to expect.',
    category: 'Pediatric',
    readingTime: '4 min read',
    date: '2024-01-28',
    imageUrl: '',
    slug: 'child-first-dentist-visit',
  },
  {
    id: '6',
    title: 'Modern Orthodontics: Braces vs Clear Aligners',
    excerpt: 'Comparing traditional braces with clear aligners — costs, duration, comfort, and results to help you make the right choice.',
    category: 'Orthodontics',
    readingTime: '6 min read',
    date: '2024-01-20',
    imageUrl: '',
    slug: 'braces-vs-clear-aligners',
  },
];

const categories = ['All', 'Dental Care', 'Oral Health', 'Cosmetic', 'Orthodontics', 'Pediatric'];

import { useBlog } from '../../hooks/useBlog';

export function BlogSection() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPost, setSelectedPost] = useState<any | null>(null);
  
  const { posts } = useBlog(true); // only published posts
  
  const displayPosts = posts.length > 0
    ? posts.map(p => ({
        id: p.id,
        title: p.title,
        excerpt: p.excerpt,
        category: p.category,
        readingTime: '5 min read', // Placeholder reading time
        date: p.publishedAt || p.createdAt,
        imageUrl: p.featuredImageUrl,
        slug: p.slug,
        content: p.content
      }))
    : blogData;

  const filteredPosts = displayPosts.filter((post) => {
    const matchesCategory = activeCategory === 'All' || post.category === activeCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section id="blog" className="relative py-20 overflow-hidden">
      <FloatingTeeth variant={5} />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-[var(--color-text-primary)] mb-4">
            Dental Health Blog
          </h2>
          <p className="text-[var(--color-text-secondary)] max-w-xl mx-auto">
            Expert insights and tips for maintaining your dental health
          </p>
        </motion.div>

        {/* Search + Filters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10"
        >
          {/* Category Pills */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-[var(--color-primary)] text-white'
                    : 'bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-secondary)]" />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] text-sm"
            />
          </div>
        </motion.div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post, index) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ y: -4 }}
              className="bg-[var(--color-bg)] rounded-2xl border border-[var(--color-border)] shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] transition-all overflow-hidden group cursor-pointer"
              onClick={() => setSelectedPost(post)}
            >
              {/* Featured Image */}
              <div className="aspect-video bg-[var(--color-surface)] flex items-center justify-center overflow-hidden">
                {post.imageUrl ? (
                  <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <BookOpen className="w-10 h-10 text-[var(--color-primary)]/30" />
                )}
              </div>

              <div className="p-6">
                {/* Category + Reading Time */}
                <div className="flex items-center gap-3 mb-3">
                  <span className="flex items-center gap-1 text-xs font-semibold text-[var(--color-primary)] bg-[var(--color-primary)]/10 px-2.5 py-1 rounded-full">
                    <Tag className="w-3 h-3" />
                    {post.category}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-[var(--color-text-secondary)]">
                    <Clock className="w-3 h-3" />
                    {post.readingTime}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-[var(--color-text-primary)] mb-2 line-clamp-2 group-hover:text-[var(--color-primary)] transition-colors">
                  {post.title}
                </h3>

                {/* Excerpt */}
                <p className="text-sm text-[var(--color-text-secondary)] mb-4 line-clamp-2">
                  {post.excerpt}
                </p>

                {/* Date + Read More */}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[var(--color-text-secondary)]">
                    {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                  <span className="text-sm font-semibold text-[var(--color-primary)] flex items-center gap-1 group-hover:underline">
                    Read More <ChevronRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <div className="text-center py-16">
            <p className="text-[var(--color-text-secondary)]">No articles found matching your search.</p>
          </div>
        )}
      </div>

      {/* Blog Detail Modal */}
      <AnimatePresence>
        {selectedPost && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-end"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-[var(--color-overlay)] backdrop-blur-sm"
              onClick={() => setSelectedPost(null)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* Modal Panel (slides from right) */}
            <motion.div
              className="relative w-full max-w-lg h-full bg-[var(--color-bg)] shadow-2xl overflow-y-auto"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            >
              {/* Close button */}
              <button
                onClick={() => setSelectedPost(null)}
                className="absolute top-4 right-4 p-2 rounded-lg text-[var(--color-text-secondary)] hover:bg-[var(--color-surface)] transition-colors cursor-pointer z-10"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="p-8">
                {/* Category + Reading Time */}
                <div className="flex items-center gap-3 mb-4">
                  <span className="flex items-center gap-1 text-xs font-semibold text-[var(--color-primary)] bg-[var(--color-primary)]/10 px-2.5 py-1 rounded-full">
                    <Tag className="w-3 h-3" />
                    {selectedPost.category}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-[var(--color-text-secondary)]">
                    <Clock className="w-3 h-3" />
                    {selectedPost.readingTime}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-3xl font-bold text-[var(--color-text-primary)] mb-4 leading-tight">
                  {selectedPost.title}
                </h3>

                {/* Date */}
                <p className="text-sm text-[var(--color-text-secondary)] mb-8">
                  Published on {new Date(selectedPost.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </p>

                <div className="prose prose-sm max-w-none text-[var(--color-text-primary)]">
                  {/* Featured Image in detail */}
                  <div className="aspect-video bg-[var(--color-surface)] flex items-center justify-center rounded-2xl mb-8 overflow-hidden">
                    {selectedPost.imageUrl ? (
                      <img src={selectedPost.imageUrl} alt={selectedPost.title} className="w-full h-full object-cover" />
                    ) : (
                      <BookOpen className="w-16 h-16 text-[var(--color-primary)]/20" />
                    )}
                  </div>

                  {/* Blog Content */}
                  <div 
                    className="space-y-4 leading-relaxed blog-content-styles"
                    dangerouslySetInnerHTML={{ __html: selectedPost.content || "" }}
                  />
                  {!selectedPost.content && (
                    <p className="text-[var(--color-text-secondary)] italic">
                      {selectedPost.excerpt}
                    </p>
                  )}
                </div>

                <style jsx global>{`
                  .blog-content-styles p { margin-bottom: 1rem; }
                  .blog-content-styles h1, .blog-content-styles h2, .blog-content-styles h3 { margin-top: 1.5rem; margin-bottom: 0.75rem; font-weight: bold; }
                  .blog-content-styles ul, .blog-content-styles ol { padding-left: 1.5rem; margin-bottom: 1rem; }
                  .blog-content-styles ul { list-style-type: disc; }
                  .blog-content-styles ol { list-style-type: decimal; }
                  .blog-content-styles img { max-width: 100%; border-radius: 0.75rem; margin: 1.5rem 0; }
                `}</style>

                {/* Share / Tags Placeholder */}
                <div className="mt-12 pt-8 border-t border-[var(--color-border)]">
                  <h4 className="text-sm font-bold text-[var(--color-text-primary)] mb-4">Related Topics</h4>
                  <div className="flex flex-wrap gap-2">
                    {['Teeth Hygiene', 'Dental Care', 'Health Tips'].map(tag => (
                      <span key={tag} className="text-xs text-[var(--color-text-secondary)] bg-[var(--color-surface)] px-3 py-1.2 rounded-md">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
