import { Metadata } from 'next';

const defaultUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://draamirmustafa.com';

export function constructMetadata({
  title = 'Dr. Aamir Mustafa Dental Care | Top Dentist in Lahore',
  description = 'Experience world-class dental care with Dr. Aamir Mustafa. Offering modern treatments including implants, root canals, and cosmetic dentistry in a welcoming environment.',
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
      siteName: 'Dr. Aamir Mustafa Dental Care',
      locale: 'en_PK',
      type: 'website',
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
    ...(noIndex && {
      robots: {
        index: false,
        follow: false,
      },
    }),
  };
}
