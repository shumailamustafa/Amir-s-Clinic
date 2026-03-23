import { Metadata } from 'next';

const defaultUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://aamirsdentalcare.web.app';

export function constructMetadata({
  title = 'Dr. Aamir Mustafa Dental Care | Best Dentist in Lahore, Pakistan',
  description = 'Dr. Aamir Mustafa Dental Care Clinic — Top-rated dentist in Lahore offering dental implants, root canal treatment, teeth whitening, braces, cosmetic dentistry & emergency dental care. Book your appointment today!',
  image = '/og-image.jpg',
  icons = '/favicon.ico',
  noIndex = false,
}: {
  title?: string;
  description?: string;
  image?: string;
  icons?: string;
  noIndex?: boolean;
} = {}): Metadata {
  return {
    title,
    description,
    keywords: [
      'dentist in Lahore',
      'best dentist in Lahore',
      'dental clinic Lahore',
      'Dr Aamir Mustafa',
      'Aamir Mustafa dentist',
      'dental implants Lahore',
      'root canal treatment Lahore',
      'teeth whitening Lahore',
      'braces Lahore',
      'cosmetic dentistry Pakistan',
      'dental care clinic',
      'emergency dentist Lahore',
      'dental surgeon Lahore',
      'affordable dental care Pakistan',
    ],
    openGraph: {
      title,
      description,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: 'Dr. Aamir Mustafa Dental Care Clinic - Best Dentist in Lahore',
        },
      ],
      siteName: 'Dr. Aamir Mustafa Dental Care',
      locale: 'en_PK',
      type: 'website',
      url: defaultUrl,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
      creator: '@DrAamirMustafa',
    },
    icons,
    metadataBase: new URL(defaultUrl),
    alternates: {
      canonical: defaultUrl,
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true, googleBot: { index: true, follow: true } },
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || '',
    },
  };
}
