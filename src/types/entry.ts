export interface Entry {
  id: string;
  title: string;
  date: string | null;
  emoji: string;
  tags: string[];
  preview?: string;
}

export interface EntryDetail extends Entry {
  blocks: Block[];
}

export type Block =
  | { type: 'paragraph'; text: string }
  | { type: 'h1'; text: string }
  | { type: 'h2'; text: string }
  | { type: 'h3'; text: string }
  | { type: 'bullet'; text: string }
  | { type: 'number'; text: string }
  | { type: 'quote'; text: string }
  | { type: 'code'; text: string; language: string }
  | { type: 'image'; url: string; caption: string }
  | { type: 'divider' }
  | { type: 'unsupported'; originalType: string };
