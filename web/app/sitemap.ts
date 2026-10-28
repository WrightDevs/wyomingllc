import type { MetadataRoute } from 'next';
import { APP_URL } from '@/lib/env';

export default function sitemap(): MetadataRoute.Sitemap {
    const now = new Date();
    return [
        { url: `${APP_URL}/`, lastModified: now, changeFrequency: 'weekly', priority: 1 },
        { url: `${APP_URL}/signup`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
        { url: `${APP_URL}/login`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 }
    ];
}
