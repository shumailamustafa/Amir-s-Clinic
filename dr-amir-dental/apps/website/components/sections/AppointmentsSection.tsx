'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  Clock,
  User,
  Phone,
  FileText,
  CheckCircle2,
  Upload,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Copy,
  Check,
} from 'lucide-react';
import { Button, Input } from '@dental/ui';
import { FloatingTeeth } from '../ui/FloatingTeeth';
import { useAppointments } from '../../hooks/useAppointments';
import { createAppointment } from '@dental/firebase';
import { uploadToCloudinary } from '@dental/firebase';

type BookingStep = 'date' | 'time' | 'info' | 'payment' | 'confirmation';

const STEPS: { id: BookingStep; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'date', label: 'Date', icon: Calendar },
  { id: 'time', label: 'Time', icon: Clock },
  { id: 'info', label: 'Details', icon: User },
  { id: 'payment', label: 'Payment', icon: CreditCard },
  { id: 'confirmation', label: 'Done', icon: CheckCircle2 },
];

const TIME_SLOTS = [
  '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '12:00 PM', '12:30 PM', '02:00 PM', '02:30 PM',
  '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM',
  '05:00 PM', '05:30 PM', '06:00 PM', '06:30 PM',
  '07:00 PM', '07:30 PM',
];

const SERVICES_LIST = [
  'Dental Implants', 'Root Canal Treatment', 'Teeth Whitening',
  'Aesthetic Crowns', 'Orthodontics', 'Scaling & Cleaning', 'General Checkup',
];

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'];

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function generateCalendarDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(i);
  return days;
}

export function AppointmentsSection() {
  const [currentStep, setCurrentStep] = useState<BookingStep>('date');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [calendarMonth, setCalendarMonth] = useState(new Date().getMonth());
  const [calendarYear, setCalendarYear] = useState(new Date().getFullYear());
  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentScreenshot, setPaymentScreenshot] = useState<File | null>(null);
  const [copied, setCopied] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [reference, setReference] = useState('');

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const dateString = selectedDate ? selectedDate.toISOString().split('T')[0] : '';
  const { bookedSlots } = useAppointments(dateString);

  const currentStepIndex = STEPS.findIndex(s => s.id === currentStep);

  const goNext = () => {
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < STEPS.length) {
      setCurrentStep(STEPS[nextIndex].id);
    }
  };

  const goBack = () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStep(STEPS[prevIndex].id);
    }
  };

  const isDateValid = selectedDate !== null;
  const isTimeValid = selectedTime !== '';
  const isInfoValid = patientName.trim() !== '' && patientPhone.trim() !== '' && selectedService !== '';

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      let paymentScreenshotUrl = '';
      if (paymentScreenshot) {
        paymentScreenshotUrl = await uploadToCloudinary(paymentScreenshot, 'dr-amir-payments');
      }

      const refNum = `REF-${Date.now().toString(36).toUpperCase()}`;
      setReference(refNum);

      await createAppointment({
        patientName,
        phone: patientPhone,
        email: '',
        serviceId: selectedService,
        date: dateString,
        timeSlot: selectedTime,
        referenceNumber: refNum,
        paymentMethod: 'online',
        paymentStatus: paymentScreenshot ? 'screenshot_submitted' : 'pending',
        paymentScreenshotUrl,
        status: 'pending',
        notes,
        createdAt: new Date().toISOString(),
      });
      
      goNext();
    } catch (error) {
      console.error('Failed to submit appointment:', error);
      alert('Failed to submit appointment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCopyAccount = () => {
    navigator.clipboard.writeText('JazzCash: 0300-1234567 (Dr. Amir)');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const calendarDays = generateCalendarDays(calendarYear, calendarMonth);

  const prevMonth = () => {
    if (calendarMonth === 0) {
      setCalendarMonth(11);
      setCalendarYear(calendarYear - 1);
    } else {
      setCalendarMonth(calendarMonth - 1);
    }
  };

  const nextMonth = () => {
    if (calendarMonth === 11) {
      setCalendarMonth(0);
      setCalendarYear(calendarYear + 1);
    } else {
      setCalendarMonth(calendarMonth + 1);
    }
  };

  return (
    <section id="appointments" className="relative py-20 overflow-hidden">
      <FloatingTeeth variant={3} />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-[var(--color-text-primary)] mb-4">
            Book an Appointment
          </h2>
          <p className="text-[var(--color-text-secondary)] max-w-xl mx-auto">
            Choose your preferred date and time — we&apos;ll confirm your appointment
          </p>
        </motion.div>

        {/* Progress Stepper */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <div className="flex items-center justify-between max-w-md mx-auto">
            {STEPS.map((step, index) => (
              <React.Fragment key={step.id}>
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                      index <= currentStepIndex
                        ? 'bg-[var(--color-primary)] text-white'
                        : 'bg-[var(--color-surface)] text-[var(--color-text-secondary)] border border-[var(--color-border)]'
                    }`}
                  >
                    <step.icon className="w-4 h-4" />
                  </div>
                  <span className={`text-xs mt-1.5 font-medium ${
                    index <= currentStepIndex ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-secondary)]'
                  }`}>
                    {step.label}
                  </span>
                </div>
                {index < STEPS.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-2 rounded-full transition-colors ${
                    index < currentStepIndex ? 'bg-[var(--color-primary)]' : 'bg-[var(--color-border)]'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </motion.div>

        {/* Step Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-[var(--color-bg)] border border-[var(--color-border)] rounded-2xl shadow-[var(--shadow-card)] p-6 sm:p-8"
        >
          <AnimatePresence mode="wait">
            {/* Step 1: Date Selection */}
            {currentStep === 'date' && (
              <motion.div key="date" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-6">Select a Date</h3>

                {/* Calendar Header */}
                <div className="flex items-center justify-between mb-4">
                  <button onClick={prevMonth} className="p-2 rounded-lg hover:bg-[var(--color-surface)] transition-colors cursor-pointer">
                    <ChevronLeft className="w-5 h-5 text-[var(--color-text-primary)]" />
                  </button>
                  <span className="text-lg font-semibold text-[var(--color-text-primary)]">
                    {MONTHS[calendarMonth]} {calendarYear}
                  </span>
                  <button onClick={nextMonth} className="p-2 rounded-lg hover:bg-[var(--color-surface)] transition-colors cursor-pointer">
                    <ChevronRight className="w-5 h-5 text-[var(--color-text-primary)]" />
                  </button>
                </div>

                {/* Day headers */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {DAYS_OF_WEEK.map(d => (
                    <div key={d} className="text-center text-xs font-semibold text-[var(--color-text-secondary)] py-2">{d}</div>
                  ))}
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-1">
                  {calendarDays.map((day, i) => {
                    if (day === null) return <div key={`empty-${i}`} />;
                    const date = new Date(calendarYear, calendarMonth, day);
                    const isPast = date < today;
                    const isSunday = date.getDay() === 0;
                    const isSelected = selectedDate?.toDateString() === date.toDateString();
                    const isToday = date.toDateString() === today.toDateString();
                    const isDisabled = isPast || isSunday;

                    return (
                      <button
                        key={day}
                        disabled={isDisabled}
                        onClick={() => setSelectedDate(date)}
                        className={`h-10 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                          isDisabled
                            ? 'text-[var(--color-text-secondary)]/40 cursor-not-allowed'
                            : isSelected
                            ? 'bg-[var(--color-primary)] text-white'
                            : isToday
                            ? 'border-2 border-[var(--color-primary)] text-[var(--color-primary)]'
                            : 'text-[var(--color-text-primary)] hover:bg-[var(--color-surface)]'
                        }`}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>

                <div className="mt-6 flex justify-end">
                  <Button onClick={goNext} disabled={!isDateValid}>
                    Next — Choose Time
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 2: Time Selection */}
            {currentStep === 'time' && (
              <motion.div key="time" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-2">Choose Time Slot</h3>
                <p className="text-sm text-[var(--color-text-secondary)] mb-6">
                  {selectedDate?.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                </p>

                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                  {TIME_SLOTS.map((slot) => {
                    const isBooked = bookedSlots.includes(slot);
                    return (
                      <button
                        key={slot}
                        disabled={isBooked}
                        onClick={() => setSelectedTime(slot)}
                        className={`py-2.5 px-3 rounded-lg text-sm font-medium border transition-all cursor-pointer ${
                          isBooked
                            ? 'bg-[var(--color-surface)] border-[var(--color-surface)] text-[var(--color-text-secondary)]/50 cursor-not-allowed line-through'
                            : selectedTime === slot
                            ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)]'
                            : 'border-[var(--color-border)] text-[var(--color-text-primary)] hover:border-[var(--color-primary)]'
                        }`}
                      >
                        {slot}
                      </button>
                    );
                  })}
                </div>

                <div className="mt-6 flex justify-between">
                  <Button variant="ghost" onClick={goBack}><ChevronLeft className="w-4 h-4 mr-1" /> Back</Button>
                  <Button onClick={goNext} disabled={!isTimeValid}>Next — Your Details</Button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Patient Info */}
            {currentStep === 'info' && (
              <motion.div key="info" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-6">Your Details</h3>

                <div className="space-y-4">
                  <Input
                    label="Full Name"
                    placeholder="Enter your full name"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
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
                    <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1.5">Service</label>
                    <select
                      value={selectedService}
                      onChange={(e) => setSelectedService(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                    >
                      <option value="">Select a service</option>
                      {SERVICES_LIST.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1.5">Notes (optional)</label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={3}
                      placeholder="Any additional notes or concerns..."
                      className="w-full px-4 py-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] resize-none"
                    />
                  </div>
                </div>

                <div className="mt-6 flex justify-between">
                  <Button variant="ghost" onClick={goBack}><ChevronLeft className="w-4 h-4 mr-1" /> Back</Button>
                  <Button onClick={goNext} disabled={!isInfoValid}>Next — Payment</Button>
                </div>
              </motion.div>
            )}

            {/* Step 4: Payment Screenshot Upload */}
            {currentStep === 'payment' && (
              <motion.div key="payment" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-2">Payment</h3>
                <p className="text-sm text-[var(--color-text-secondary)] mb-6">
                  Send your fee and upload the screenshot for verification
                </p>

                {/* Account Details */}
                <div className="bg-[var(--color-surface)] rounded-xl p-5 mb-6 border border-[var(--color-border)]">
                  <h4 className="text-sm font-semibold text-[var(--color-text-primary)] mb-3">Payment Details</h4>
                  <div className="space-y-2 text-sm text-[var(--color-text-secondary)]">
                    <p><strong>JazzCash:</strong> 0300-1234567</p>
                    <p><strong>Account Title:</strong> Dr. Amir</p>
                    <p><strong>Consultation Fee:</strong> Rs. 1,500</p>
                  </div>
                  <button
                    onClick={handleCopyAccount}
                    className="mt-3 flex items-center gap-2 text-sm text-[var(--color-primary)] hover:underline cursor-pointer"
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {copied ? 'Copied!' : 'Copy account details'}
                  </button>
                </div>

                {/* Screenshot Upload */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
                    Upload Payment Screenshot
                  </label>
                  <label
                    className={`flex flex-col items-center justify-center w-full h-32 rounded-xl border-2 border-dashed cursor-pointer transition-colors ${
                      paymentScreenshot
                        ? 'border-[var(--color-status-open)] bg-[var(--color-status-open)]/5'
                        : 'border-[var(--color-border)] hover:border-[var(--color-primary)] bg-[var(--color-surface)]'
                    }`}
                  >
                    {paymentScreenshot ? (
                      <div className="text-center">
                        <CheckCircle2 className="w-8 h-8 text-[var(--color-status-open)] mx-auto mb-2" />
                        <p className="text-sm text-[var(--color-text-primary)] font-medium">{paymentScreenshot.name}</p>
                        <p className="text-xs text-[var(--color-text-secondary)]">Click to change</p>
                      </div>
                    ) : (
                      <div className="text-center">
                        <Upload className="w-8 h-8 text-[var(--color-text-secondary)] mx-auto mb-2" />
                        <p className="text-sm text-[var(--color-text-secondary)]">Click or drag to upload</p>
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => setPaymentScreenshot(e.target.files?.[0] || null)}
                    />
                  </label>
                </div>

                <div className="flex justify-between">
                  <Button variant="ghost" onClick={goBack}><ChevronLeft className="w-4 h-4 mr-1" /> Back</Button>
                  <Button onClick={handleSubmit} isLoading={submitting}>
                    Submit Appointment
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 5: Confirmation */}
            {currentStep === 'confirmation' && (
              <motion.div
                key="confirmation"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
                >
                  <CheckCircle2 className="w-20 h-20 text-[var(--color-status-open)] mx-auto mb-6" />
                </motion.div>
                <h3 className="text-2xl font-bold text-[var(--color-text-primary)] mb-3">
                  Appointment Submitted!
                </h3>
                <p className="text-[var(--color-text-secondary)] mb-2">
                  Your appointment request has been received.
                </p>
                <p className="text-sm text-[var(--color-text-secondary)] mb-2">
                  <strong>Date:</strong> {selectedDate?.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                </p>
                <p className="text-sm text-[var(--color-text-secondary)] mb-2">
                  <strong>Time:</strong> {selectedTime}
                </p>
                <p className="text-sm text-[var(--color-text-secondary)] mb-6">
                  <strong>Reference:</strong> {reference}
                </p>
                <p className="text-sm text-[var(--color-primary)] font-medium bg-[var(--color-primary)]/10 inline-block px-4 py-2 rounded-full">
                  We&apos;ll confirm your appointment via WhatsApp / SMS
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
