'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, MessageCircle, Send, Clock, User } from 'lucide-react';
import { Button, Input } from '@dental/ui';
import { FloatingTeeth } from '../ui/FloatingTeeth';
import { useClinicStatus } from '../../hooks/useClinicStatus';
import { createMessage } from '@dental/firebase';

export function ContactSection() {
  const { config } = useClinicStatus();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const { error } = await createMessage({
      name,
      email,
      phone,
      message,
      status: 'unread',
      createdAt: new Date().toISOString(),
    });

    if (error) {
       alert(`Failed to send message: ${error}`);
    } else {
      setSubmitted(true);
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
      setTimeout(() => setSubmitted(false), 5000);
    }
    setSubmitting(false);
  };

  const clinicPhone = config?.phone || '0300-1234567';
  const clinicEmail = config?.email || 'info@dramirdental.com';
  const clinicAddress = config?.address || 'Main Boulevard, Gulberg III, Lahore';
  const clinicWhatsapp = config?.whatsapp || '923001234567';

  const contactInfo = [
    {
      icon: Phone,
      title: 'Phone',
      value: clinicPhone,
      href: `tel:${clinicPhone.replace(/[^0-9+]/g, '')}`,
      description: 'Call us anytime during working hours',
    },
    {
      icon: Mail,
      title: 'Email',
      value: clinicEmail,
      href: `mailto:${clinicEmail}`,
      description: 'We reply within 24 hours',
    },
    {
      icon: MapPin,
      title: 'Address',
      value: clinicAddress,
      href: 'https://maps.google.com',
      description: 'Visit us at our clinic',
    },
    {
      icon: Clock,
      title: 'Working Hours',
      value: 'Mon-Fri: 10AM-8PM',
      href: undefined,
      description: 'Saturday: 10AM-4PM',
    },
  ];

  return (
    <section id="contact" className="relative py-20 bg-[var(--color-surface)] overflow-hidden">
      <FloatingTeeth variant={6} />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-[var(--color-text-primary)] mb-4">
            Contact Us
          </h2>
          <p className="text-[var(--color-text-secondary)] max-w-xl mx-auto">
            Have a question or want to schedule a consultation? Get in touch with us
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info Cards */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-6">
              Get In Touch
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {contactInfo.map((info, index) => (
                <motion.div
                  key={info.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-[var(--color-bg)] rounded-xl p-5 border border-[var(--color-border)] hover:border-[var(--color-primary)]/50 transition-all group"
                >
                  <div className="w-10 h-10 rounded-lg bg-[var(--color-primary)]/10 flex items-center justify-center mb-3 group-hover:bg-[var(--color-primary)]/20 transition-colors">
                    <info.icon className="w-5 h-5 text-[var(--color-primary)]" />
                  </div>
                  <h4 className="font-semibold text-[var(--color-text-primary)] text-sm mb-1">
                    {info.title}
                  </h4>
                  {info.href ? (
                    <a
                      href={info.href}
                      target={info.href.startsWith('http') ? '_blank' : undefined}
                      rel="noopener noreferrer"
                      className="text-sm text-[var(--color-primary)] hover:underline block"
                    >
                      {info.value}
                    </a>
                  ) : (
                    <p className="text-sm text-[var(--color-text-primary)]">{info.value}</p>
                  )}
                  <p className="text-xs text-[var(--color-text-secondary)] mt-1">{info.description}</p>
                </motion.div>
              ))}
            </div>

            {/* WhatsApp CTA */}
            <motion.a
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              href={`https://wa.me/${clinicWhatsapp.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-[var(--color-whatsapp-green)] text-white rounded-xl p-4 hover:opacity-90 transition-opacity"
            >
              <MessageCircle className="w-6 h-6" />
              <div>
                <p className="font-semibold">Chat on WhatsApp</p>
                <p className="text-sm opacity-90">Usually responds within an hour</p>
              </div>
            </motion.a>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="bg-[var(--color-bg)] rounded-2xl p-6 sm:p-8 border border-[var(--color-border)] shadow-[var(--shadow-card)]">
              <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-6">
                Send a Message
              </h3>

              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <div className="w-16 h-16 rounded-full bg-[var(--color-status-open)]/10 flex items-center justify-center mx-auto mb-4">
                    <Send className="w-8 h-8 text-[var(--color-status-open)]" />
                  </div>
                  <h4 className="text-lg font-bold text-[var(--color-text-primary)] mb-2">
                    Message Sent!
                  </h4>
                  <p className="text-sm text-[var(--color-text-secondary)]">
                    We&apos;ll get back to you within 24 hours.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <Input
                    label="Full Name"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    icon={<User className="w-4 h-4" />}
                    required
                  />
                  <Input
                    label="Email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    icon={<Mail className="w-4 h-4" />}
                    required
                  />
                  <Input
                    label="Phone"
                    placeholder="0300-1234567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    icon={<Phone className="w-4 h-4" />}
                  />
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1.5">Message</label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={4}
                      required
                      placeholder="How can we help you?"
                      className="w-full px-4 py-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] resize-none"
                    />
                  </div>
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full"
                    isLoading={submitting}
                    disabled={!name || !email || !message}
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Send Message
                  </Button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
