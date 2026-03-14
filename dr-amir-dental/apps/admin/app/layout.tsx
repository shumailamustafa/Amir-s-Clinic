import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '../components/providers/ThemeProvider';
import { ErrorBoundary } from '../components/providers/ErrorBoundary';
import { GlobalErrorHandler } from '../components/providers/GlobalErrorHandler';
import { Toaster } from 'sonner';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Admin Portal — Dr. Amir Dental Care',
  description: 'Management dashboard for Dr. Amir Dental Care',
};

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
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ErrorBoundary>
          <GlobalErrorHandler />
          <ThemeProvider>
            {children}
          </ThemeProvider>
          <Toaster position="bottom-right" richColors />
        </ErrorBoundary>
      </body>
    </html>
  );
}
