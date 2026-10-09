import type { StarlightAiActionsOptions } from '../types.js';

const PREFIX = 'virtual:starlight-ai-actions/options';
const resolveVirtualModuleId = (id: string) => `\0${id}`;

export function vitePluginAiActions(options: StarlightAiActionsOptions) {
  const modules: Record<string, string> = {
    [PREFIX]: `export default ${JSON.stringify(options)}`,
  };
  const moduleResolutionMap = Object.fromEntries(Object.keys(modules).map((key) => [resolveVirtualModuleId(key), key]));
  return {
    name: 'vite-plugin-starlight-ai-actions',
    load(id: string) {
      const moduleId = moduleResolutionMap[id];
      return moduleId ? modules[moduleId] : undefined;
    },
    resolveId(id: string) {
      return id in modules ? resolveVirtualModuleId(id) : undefined;
    },
  };
}
