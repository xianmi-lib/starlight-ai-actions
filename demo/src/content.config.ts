import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';
import { aiActionsSchema } from 'starlight-ai-actions/schema';

const docs = defineCollection({
  loader: docsLoader(),
  schema: docsSchema({ extend: z.object({ aiActions: aiActionsSchema() }) }),
});
export const collections = { docs };
