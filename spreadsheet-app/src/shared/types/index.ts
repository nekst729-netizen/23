export type CellValue = string | number | boolean | null;

export interface CellData {
  value: CellValue;
  formula?: string;
  formatting?: CellFormatting;
}

export interface CellFormatting {
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  backgroundColor?: string;
  textColor?: string;
  align?: 'left' | 'center' | 'right';
  format?: 'number' | 'percent' | 'currency' | 'date' | 'text';
}

export interface CellPosition {
  row: number;
  col: number;
}

export interface DocumentData {
  id: string;
  name: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  rows: number;
  columns: number;
  preview?: CellValue[][];
}