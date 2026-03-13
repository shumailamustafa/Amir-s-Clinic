'use client';

import Script from 'next/script';

export function AnalyticsProvider({ measurementId }: { measurementId?: string }) {
  if (!measurementId || process.env.NODE_ENV !== 'production') {
    return null; // Only render GA in production and if ID exists
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', '${measurementId}');
        `}
      </Script>
    </>
  );
}
