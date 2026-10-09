import { validateOptions } from './config.js';
import type { StarlightAiActionsOptions } from './types.js';
import { vitePluginAiActions } from './libs/vite.js';

export default function starlightAiActions(userOptions: StarlightAiActionsOptions = {}) {
  const options = validateOptions(userOptions);
  return {
    name: 'starlight-ai-actions',
    hooks: {
      'config:setup'({ addIntegration, config: starlightConfig, updateConfig }: any) {
        updateConfig({
          components: {
            PageTitle: 'starlight-ai-actions/PageTitle.astro',
            ...starlightConfig.components,
          },
        });
        addIntegration({
          name: 'starlight-ai-actions-integration',
          hooks: {
            'astro:config:setup': ({ updateConfig: updateAstroConfig }: any) => {
              updateAstroConfig({ vite: { plugins: [vitePluginAiActions(options)] } });
            },
          },
        });
      },
    },
  };
}
