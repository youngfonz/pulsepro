import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/dashboard', '/projects', '/tasks', '/clients', '/calendar', '/bookmarks', '/settings', '/onboarding', '/sign-in', '/sign-up'],
    },
    sitemap: 'https://pulsepro.work/sitemap.xml',
  }
}
