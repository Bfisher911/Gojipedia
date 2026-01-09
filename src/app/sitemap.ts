import type { MetadataRoute } from 'next';
import { getMonsters, getWorks, getPosts } from '@/lib/db';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXTAUTH_URL || 'https://gojipedia.com';

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/monsters`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/movies`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/timeline`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/lore`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/stories`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/shop`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/about/fan-power-index`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];

  // Dynamic monster pages
  const monsters = await getMonsters();
  const monsterPages: MetadataRoute.Sitemap = monsters.map((monster) => ({
    url: `${baseUrl}/monsters/${monster.slug}`,
    lastModified: monster.updatedAt,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  // Dynamic work pages
  const works = await getWorks();
  const workPages: MetadataRoute.Sitemap = works.map((work) => ({
    url: `${baseUrl}/movies/${work.slug}`,
    lastModified: work.updatedAt,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  // Dynamic post pages
  const posts = await getPosts({ status: 'published' });
  const postPages: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${baseUrl}/lore/${post.slug}`,
    lastModified: post.updatedAt,
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  return [...staticPages, ...monsterPages, ...workPages, ...postPages];
}
