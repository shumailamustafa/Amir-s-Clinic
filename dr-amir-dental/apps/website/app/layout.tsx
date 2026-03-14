import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '../components/providers/ThemeProvider';
import { AnalyticsProvider } from '../components/providers/AnalyticsProvider';
import { LocalBusinessSchema } from '../lib/schema';
import { constructMetadata } from '../lib/metadata';
import { ErrorBoundary } from '../components/providers/ErrorBoundary';
import { GlobalErrorHandler } from '../components/providers/GlobalErrorHandler';
import { DevErrorPanel } from '../components/dev/DevErrorPanel';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { EmergencyBanner } from '../components/ui/EmergencyBanner';
import { WhatsAppButton } from '../components/layout/WhatsAppButton';
import { Toaster } from 'sonner';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = constructMetadata();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('dental-theme');
                  if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    document.documentElement.setAttribute('data-theme', 'dark');
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
        <LocalBusinessSchema />
      </head>
      <body className={`${inter.variable} font-sans antialiased bg-[var(--color-bg)] text-[var(--color-text-primary)] min-h-screen flex flex-col`}>
        <ErrorBoundary>
          <GlobalErrorHandler />
          <ThemeProvider>
            <EmergencyBanner />
            <Navbar />
            <main className={inter.className}>{children}</main>
            <Footer />
            <WhatsAppButton />
          </ThemeProvider>
          <DevErrorPanel />
          <Toaster position="bottom-right" />
        </ErrorBoundary>
        <AnalyticsProvider measurementId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />
      </body>
    </html>
  );
}
