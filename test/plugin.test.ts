import { describe, expect, it, vi } from 'vitest';
import starlightAiActions from '../src/index.js';

const setupCtx = () => ({
  addIntegration: vi.fn(),
  addRouteMiddleware: vi.fn(),
  command: 'build' as const,
  config: { components: {} } as any,
  updateConfig: vi.fn(),
});

describe('starlightAiActions', () => {
  it('注册 PageTitle 覆盖且用户覆盖优先', () => {
    const ctx = { ...setupCtx(), config: { components: { PageTitle: 'user/Page.astro' } } as any };
    starlightAiActions({ markdown: { mdUrl: '/md/{filePath}' }, direct: false, paste: false, dialog: false }).hooks['config:setup'](ctx as any);
    const arg = ctx.updateConfig.mock.calls[0][0];
    expect(arg.components.PageTitle).toBe('user/Page.astro');
  });
  it('默认注册 starlight-ai-actions/PageTitle.astro', () => {
    const ctx = setupCtx();
    starlightAiActions({ markdown: { mdUrl: '/md/{filePath}' }, direct: false, paste: false, dialog: false }).hooks['config:setup'](ctx as any);
    expect(ctx.updateConfig.mock.calls[0][0].components.PageTitle).toBe('starlight-ai-actions/PageTitle.astro');
    expect(ctx.addIntegration).toHaveBeenCalledTimes(1);
  });
  it('非法配置在工厂抛错', () => {
    expect(() => starlightAiActions({})).toThrowError(/mdUrl/);
  });
});
