export interface AiActionDetail {
  type: 'markdown' | 'direct' | 'paste';
  action: 'view' | 'copyContent' | 'copyUrl' | 'copyPrompt' | 'open';
  provider?: string;
  url?: string;
  page: { url: string; title: string };
}

export function buildDetail(input: AiActionDetail): AiActionDetail {
  return { ...input };
}

export function dispatchAiAction(detail: AiActionDetail): void {
  window.dispatchEvent(new CustomEvent('ai-actions', { detail: buildDetail(detail) }));
}
