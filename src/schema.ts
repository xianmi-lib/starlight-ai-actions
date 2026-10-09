import { z } from 'astro/zod';

/** frontmatter `aiActions`：false=整页关；{prompt}=仅覆盖提示词。用法：starlightSchema({ aiActions: aiActionsSchema() }) */
export const aiActionsSchema = () =>
  z.union([z.literal(false), z.object({ prompt: z.string().optional() })]).optional();
