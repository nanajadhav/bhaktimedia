import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const blog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.string(),
    image: z.string(),
    pubDate: z.coerce.date(),
    author: z.string().default("Team BhaktiMedia"),
    featured: z.boolean().default(false),
  }),
});

export const collections = { blog };
