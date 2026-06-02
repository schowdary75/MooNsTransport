import type { MetadataRoute } from 'next';

import { featurePages, legalPages, modules } from '../lib/site-data';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://Moon.in';
  const staticRoutes = ['/', '/modules', ...Object.keys(featurePages), ...Object.keys(legalPages)];

  return [
    ...staticRoutes.map((route) => ({
      url: `${baseUrl}${route.startsWith('/') ? route : `/${route}`}`,
      lastModified: new Date(),
    })),
    ...modules.map((module: (typeof modules)[number]) => ({
      url: `${baseUrl}/modules/${encodeURIComponent(module.id)}`,
      lastModified: new Date(),
    })),
  ];
}
