import React from 'react';

export function LocalBusinessSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Dentist',
    name: 'Dr. Amir Dental Care',
    image: 'https://dramirdental.com/og-image.jpg',
    '@id': 'https://dramirdental.com',
    url: 'https://dramirdental.com',
    telephone: '+923001234567',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '123 Health Avenue, Phase 5, DHA',
      addressLocality: 'Lahore',
      addressRegion: 'Punjab',
      postalCode: '54000',
      addressCountry: 'PK',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 31.5204,
      longitude: 74.3587,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: [
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
        ],
        opens: '10:00',
        closes: '20:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Saturday',
        opens: '10:00',
        closes: '16:00',
      },
    ],
    sameAs: [
      'https://facebook.com/dramirdental',
      'https://instagram.com/dramirdental',
    ],
    priceRange: 'PKR',
    departments: [
      {
        '@type': 'Dentist',
        name: 'Dr. Amir',
        description: 'BDS, FCPS — Head Dental Surgeon',
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
