export type BlockType = "text" | "chart" | "kpi" | "table" | "ai-summary";

export type Block = {
  id: string;
  type: BlockType;
  title?: string;
  data: Record<string, unknown>;
};

export type LayoutItem = {
  blockId: string;
  x: number;
  y: number;
  w: number;
  h: number;
};

export type Workspace = {
  id: string;
  name: string;
  blocks: Block[];
  layout: LayoutItem[];
  theme: "light" | "dark";
  createdAt: string;
  updatedAt: string;
  version: number;
};
