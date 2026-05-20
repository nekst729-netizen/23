import { CellData } from '@/shared/types';

const getCellValue = (cell?: CellData): number => {
  if (!cell || cell.value === null || cell.value === '') return 0;
  
  const value = cell.value.toString();

  if (value.startsWith('=')) return 0;
  
  const num = parseFloat(value);
  return isNaN(num) ? 0 : num;
};

const parseCellRef = (ref: string): { row: number; col: number } | null => {
  const match = ref.match(/^([A-Z]+)(\d+)$/);
  if (!match) return null;
  
  const colStr = match[1];
  const row = parseInt(match[2]) - 1;
  
  let col = 0;
  for (let i = 0; i < colStr.length; i++) {
    col = col * 26 + (colStr.charCodeAt(i) - 65);
  }
  
  return { row, col };
};

const getRangeCells = (start: string, end: string): string[] => {
  const startRef = parseCellRef(start.toUpperCase());
  const endRef = parseCellRef(end.toUpperCase());
  
  if (!startRef || !endRef) return [];
  
  const cells: string[] = [];
  
  const startCol = Math.min(startRef.col, endRef.col);
  const endCol = Math.max(startRef.col, endRef.col);
  const startRow = Math.min(startRef.row, endRef.row);
  const endRow = Math.max(startRef.row, endRef.row);
  
  const getColName = (col: number): string => {
    let name = '';
    let n = col;
    while (n >= 0) {
      name = String.fromCharCode(65 + (n % 26)) + name;
      n = Math.floor(n / 26) - 1;
    }
    return name;
  };
  
  for (let row = startRow; row <= endRow; row++) {
    for (let col = startCol; col <= endCol; col++) {
      cells.push(`${getColName(col)}${row + 1}`);
    }
  }
  
  return cells;
};

export const evaluateFormula = (
  formula: string,
  cells: Record<string, CellData>
): number | string => {
  try {
    const expr = formula.substring(1).toUpperCase().trim();
    
    if (expr.startsWith('SUM(')) {
      const range = expr.match(/SUM\(([A-Z]+\d+):([A-Z]+\d+)\)/);
      if (!range) return '#VALUE!';
      
      const cellRefs = getRangeCells(range[1], range[2]);
      const sum = cellRefs.reduce((acc, ref) => {
        return acc + getCellValue(cells[ref]);
      }, 0);
      
      return sum;
    }
    
    if (expr.startsWith('AVERAGE(')) {
      const range = expr.match(/AVERAGE\(([A-Z]+\d+):([A-Z]+\d+)\)/);
      if (!range) return '#VALUE!';
      
      const cellRefs = getRangeCells(range[1], range[2]);
      const values = cellRefs.map(ref => getCellValue(cells[ref]));
      const sum = values.reduce((acc, val) => acc + val, 0);
      
      return values.length > 0 ? sum / values.length : 0;
    }
    
    if (expr.startsWith('MIN(')) {
      const range = expr.match(/MIN\(([A-Z]+\d+):([A-Z]+\d+)\)/);
      if (!range) return '#VALUE!';
      
      const cellRefs = getRangeCells(range[1], range[2]);
      const values = cellRefs.map(ref => getCellValue(cells[ref]));
      
      return values.length > 0 ? Math.min(...values) : 0;
    }
    
    if (expr.startsWith('MAX(')) {
      const range = expr.match(/MAX\(([A-Z]+\d+):([A-Z]+\d+)\)/);
      if (!range) return '#VALUE!';
      
      const cellRefs = getRangeCells(range[1], range[2]);
      const values = cellRefs.map(ref => getCellValue(cells[ref]));
      
      return values.length > 0 ? Math.max(...values) : 0;
    }
    
    let evalExpr = expr;
    const cellRefs = expr.match(/[A-Z]+\d+/g) || [];
    
    cellRefs.forEach(ref => {
      const value = getCellValue(cells[ref]);
      evalExpr = evalExpr.replace(new RegExp(ref, 'g'), value.toString());
    });
    
    if (!/^[\d\s+\-*/().]+$/.test(evalExpr)) {
      return '#VALUE!';
    }
    
    const result = new Function('return ' + evalExpr)();
    return isNaN(result) ? '#VALUE!' : result;
    
  } catch (error) {
    console.error('Formula evaluation error:', error);
    return '#ERROR!';
  }
};