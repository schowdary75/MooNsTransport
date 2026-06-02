import { Metadata } from 'next';

export function constructMetadata({
  title = 'Moon - India\'s Transit Super-App',
  description = 'Plan journeys, book tickets, track live transport, and find the fastest way across Indian cities.',
  image = '/og-image.png',
  icons = '/favicon.ico',
  noIndex = false
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
          url: image
        }
      ],
      type: 'website',
      siteName: 'Moon'
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
      creator: '@MoonTransit'
    },
    icons,
    metadataBase: new URL('https://Moon.in'),
    ...(noIndex && {
      robots: {
        index: false,
        follow: false
      }
    })
  };
}
