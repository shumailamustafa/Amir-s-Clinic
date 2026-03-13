import React from 'react';
import { constructMetadata } from '../../lib/metadata';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';

export const metadata = constructMetadata({
  title: 'Terms of Service | Dr. Amir Dental Care',
  description: 'Terms and conditions for using the Dr. Amir Dental Care website and services.',
});

export default function TermsOfServicePage() {
  return (
    <main className="min-h-screen bg-[var(--color-bg)] flex flex-col pt-24">
      <Navbar />
      
      <div className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 md:py-20 text-[var(--color-text-primary)]">
        <h1 className="text-4xl md:text-5xl font-bold mb-8">Terms of Service</h1>
        
        <div className="prose prose-lg dark:prose-invert max-w-none text-[var(--color-text-secondary)] space-y-6">
          <p>Last updated: March 15, 2024</p>
          
          <p>
            Please read these Terms of Service ("Terms", "Terms of Service") carefully before using the 
            dramirdental.com website (the "Service") operated by Dr. Amir Dental Care ("us", "we", or "our").
          </p>

          <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mt-12 mb-4">1. Appointments and Cancellations</h2>
          <p>
            When you book an appointment with us, you agree to provide accurate and complete information. We require 
            at least 24 hours notice for any cancellations or rescheduling of appointments. Failure to do so may 
            result in a cancellation fee.
          </p>

          <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mt-12 mb-4">2. Payments</h2>
          <p>
            Payment for services is due at the time of treatment unless prior arrangements have been made. We accept 
            cash, major credit cards, and online transfers (JazzCash, EasyPaisa). Online payment screenshots must be 
            uploaded within 30 minutes of booking to secure your slot.
          </p>

          <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mt-12 mb-4">3. Medical Disclaimer</h2>
          <p>
            The content on our website is provided for general informational purposes only and is not intended as, 
            nor should it be considered a substitute for, professional medical advice, diagnosis, or treatment. 
            Always seek the advice of your dentist or other qualified health provider with any questions you may 
            have regarding a medical condition.
          </p>

          <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mt-12 mb-4">4. Changes to Terms</h2>
          <p>
            We reserve the right, at our sole discretion, to modify or replace these Terms at any time. By continuing 
            to access or use our Service after those revisions become effective, you agree to be bound by the revised terms.
          </p>
        </div>
      </div>

      <Footer />
    </main>
  );
}
