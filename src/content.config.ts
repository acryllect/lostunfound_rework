import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    artist: z.string(),
    categories: z.array(z.enum(['Songwriting', 'Production', 'Mixing', 'Mastering'])),
    genre: z.array(z.string()).optional(),
    cover_image: z.string().optional(),
    spotify_url: z.string().url().optional().or(z.literal('')),
    soundcloud_url: z.string().url().optional().or(z.literal('')),
    description: z.string().optional(),
    credits: z.array(z.object({ role: z.string(), name: z.string() })).optional(),
    publish_date: z.coerce.date(),
    published: z.boolean().default(true),
  }),
});

export const collections = { projects };
