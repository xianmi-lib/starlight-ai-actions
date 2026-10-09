export type MarkdownItem = 'view' | 'copyContent' | 'copyUrl' | 'copyPrompt';
export type DirectStyle = 'combine' | 'round' | 'square';

export interface EntryLike {
  id: string;
  filePath?: string;
  data: { title?: string; aiActions?: false | { prompt?: string } };
}

export interface ProviderBase {
  name: string;
  href: string;
  icon: string;
  iconUrl?: string;
  bg?: string;
  scale?: number;
  ring?: 'light' | 'dark';
}
export interface DirectProvider extends ProviderBase { style?: DirectStyle }
export interface PasteProvider extends ProviderBase {}

export interface Labels {
  view: string; copyContent: string; copyUrl: string; copyPrompt: string;
  copySuccess: string; copyFail: string;
  mdMenu: string; pasteOpen: string;
  dialogTitle: string; dialogHint1: string; dialogClose: string;
}

export interface StarlightAiActionsOptions {
  markdown?: { items?: MarkdownItem[]; mdUrl?: string } | false;
  direct?: DirectProvider[] | false;
  paste?: PasteProvider[] | false;
  prompt?: string;
  where?: { idPattern?: string };
  labels?: Record<string, Partial<Labels>>;
  dialog?: { title?: string; hint1?: string } | false;
}
