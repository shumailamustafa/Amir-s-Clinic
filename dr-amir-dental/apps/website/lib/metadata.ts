import { Metadata } from 'next';

const defaultUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://dramirdental.com';

export function constructMetadata({
  title = 'Dr. Amir Dental Care | Top Dentist in Lahore',
  description = 'Experience world-class dental care with Dr. Amir. Offering modern treatments including implants, root canals, and cosmetic dentistry in a welcoming environment.',
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
    openGraph: {
      title,
      description,
      images: [
        {
          url: image,
        },
      ],
      siteName: 'Dr. Amir Dental Care',
      locale: 'en_PK',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
      creator: '@DrAmirDental',
    },
    icons,
    metadataBase: new URL(defaultUrl),
    ...(noIndex && {
      robots: {
        index: false,
        follow: false,
      },
    }),
  };
}
