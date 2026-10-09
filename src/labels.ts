import type { Labels } from './types.js';

export const DEFAULT_LABELS: Record<'en' | 'zh-CN' | 'zh-TW', Labels> = {
  en: {
    view: 'View Markdown',
    copyContent: 'Copy Markdown content',
    copyUrl: 'Copy Markdown URL',
    copyPrompt: 'Copy prompt with URL',
    copySuccess: 'Copied to clipboard ✓',
    copyFail: 'Copy failed — please select and copy manually',
    mdMenu: 'Markdown tools',
    pasteOpen: 'Discuss with AI',
    dialogTitle: 'Discuss with AI',
    dialogHint1: 'Click an AI button below, then press Ctrl+V in the chat box to paste the prompt and start discussing.',
    dialogClose: 'Close',
  },
  'zh-CN': {
    view: '查看 Markdown',
    copyContent: '复制 Markdown 内容到剪贴板',
    copyUrl: '复制 Markdown URL 到剪贴板',
    copyPrompt: '复制带 URL 的提示词到剪贴板',
    copySuccess: '已复制到剪贴板 ✓',
    copyFail: '复制失败，请手动全选复制',
    mdMenu: 'Markdown 工具',
    pasteOpen: '和 AI 讨论',
    dialogTitle: '和 AI 讨论',
    dialogHint1: '点击下面 AI 按钮，并在对话框中 Ctrl v 粘贴提示词，开始讨论。',
    dialogClose: '关闭',
  },
  'zh-TW': {
    view: '檢視 Markdown',
    copyContent: '複製 Markdown 內容到剪貼簿',
    copyUrl: '複製 Markdown URL 到剪貼簿',
    copyPrompt: '複製帶 URL 的提示詞到剪貼簿',
    copySuccess: '已複製到剪貼簿 ✓',
    copyFail: '複製失敗，請手動全選複製',
    mdMenu: 'Markdown 工具',
    pasteOpen: '和 AI 討論',
    dialogTitle: '和 AI 討論',
    dialogHint1: '點擊下面 AI 按鈕，並在對話框中 Ctrl v 貼上提示詞，開始討論。',
    dialogClose: '關閉',
  },
};

export function mergeLabels(lang: string, overrides?: Record<string, Partial<Labels>>): Labels {
  const base: Labels = DEFAULT_LABELS[lang as keyof typeof DEFAULT_LABELS] ?? DEFAULT_LABELS.en;
  return { ...base, ...(overrides?.[lang] ?? {}) };
}
