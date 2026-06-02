import Head from 'next/head';

interface TransitStopSchemaProps {
  name: string;
  lat: number;
  lng: number;
  city: string;
  transitType: 'Bus' | 'Metro' | 'Train';
}

interface LocalBusinessSchemaProps {
  name: string;
  description: string;
  url: string;
  logo: string;
}

export function TransitStopJsonLd({ name, lat, lng, city, transitType }: TransitStopSchemaProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BusStop', // default fallback, schema.org has BusStop or TrainStation
    name: name,
    latitude: lat,
    longitude: lng,
    address: {
      '@type': 'PostalAddress',
      addressLocality: city,
      addressCountry: 'IN'
    }
  };

  if (transitType === 'Train') {
    jsonLd['@type'] = 'TrainStation';
  } else if (transitType === 'Metro') {
    jsonLd['@type'] = 'SubwayStation';
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function LocalBusinessJsonLd({ name, description, url, logo }: LocalBusinessSchemaProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: name,
    description: description,
    url: url,
    logo: logo,
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'IN'
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
