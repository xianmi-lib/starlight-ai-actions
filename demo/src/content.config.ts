import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';
import { aiActionsSchema } from 'starlight-ai-actions/schema';
// starlight-sidebar-topics 的页归属 frontmatter `topic`（缺了它未登记进 topic items 的页会 500）
import { topicSchema } from 'starlight-sidebar-topics/schema';

const docs = defineCollection({
  loader: docsLoader(),
  schema: docsSchema({ extend: z.object({ aiActions: aiActionsSchema(), topic: topicSchema.shape.topic }) }),
});
export const collections = { docs };
