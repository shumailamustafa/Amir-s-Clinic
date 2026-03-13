import React from 'react';
import { constructMetadata } from '../../lib/metadata';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';

export const metadata = constructMetadata({
  title: 'Privacy Policy | Dr. Amir Dental Care',
  description: 'Learn about how Dr. Amir Dental Care collects, uses, and protects your personal information.',
});

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-[var(--color-bg)] flex flex-col pt-24">
      <Navbar />
      
      <div className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 md:py-20 text-[var(--color-text-primary)]">
        <h1 className="text-4xl md:text-5xl font-bold mb-8">Privacy Policy</h1>
        
        <div className="prose prose-lg dark:prose-invert max-w-none text-[var(--color-text-secondary)] space-y-6">
          <p>Last updated: March 15, 2024</p>
          
          <p>
            At Dr. Amir Dental Care, we take your privacy seriously. This Privacy Policy explains how we collect,
            use, disclose, and safeguard your information when you visit our website or use our services.
          </p>

          <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mt-12 mb-4">1. Information We Collect</h2>
          <p>
            We may collect personal identification information from Users in a variety of ways, including, but not limited to, 
            when Users visit our site, fill out a form, book an appointment, and in connection with other activities, services, 
            features or resources we make available on our Site.
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Name, email address, and phone number</li>
            <li>Medical history relevant to dental treatments</li>
            <li>Payment information and transaction history</li>
          </ul>

          <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mt-12 mb-4">2. How We Use Your Information</h2>
          <p>We use the information we collect primarily to provide, maintain, protect and improve our current services.</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>To schedule and manage your dental appointments</li>
            <li>To send periodic emails and SMS reminders regarding your treatment</li>
            <li>To improve customer service and respond to your inquiries</li>
            <li>To process payments for services rendered</li>
          </ul>

          <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mt-12 mb-4">3. Data Security</h2>
          <p>
            We adopt appropriate data collection, storage and processing practices and security measures to protect against 
            unauthorized access, alteration, disclosure or destruction of your personal information, username, password, 
            transaction information and data stored on our Site.
          </p>

          <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mt-12 mb-4">4. Contacting Us</h2>
          <p>
            If you have any questions about this Privacy Policy, the practices of this site, or your dealings with this site, 
            please contact us at:
          </p>
          <div className="bg-[var(--color-surface)] p-6 rounded-xl border border-[var(--color-border)] mt-4 text-[var(--color-text-primary)]">
            <p className="font-bold">Dr. Amir Dental Care</p>
            <p>123 Health Avenue, Phase 5, DHA, Lahore</p>
            <p>Email: privacy@dramirdental.com</p>
            <p>Phone: 0300-1234567</p>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
