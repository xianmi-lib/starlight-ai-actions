import { describe, expect, it } from 'vitest';
import { aiActionsSchema } from '../src/schema.js';

const s = aiActionsSchema();
describe('aiActionsSchema', () => {
  it('接受 undefined / false / {prompt}', () => {
    expect(s.safeParse(undefined).success).toBe(true);
    expect(s.safeParse(false).success).toBe(true);
    expect(s.safeParse({ prompt: 'x' }).success).toBe(true);
  });
  it('拒绝错误类型', () => {
    expect(s.safeParse({ prompt: 42 }).success).toBe(false);
    expect(s.safeParse('off').success).toBe(false);
  });
});
