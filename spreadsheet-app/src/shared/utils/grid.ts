export const getColumnName = (colIndex: number): string => {
  let column = '';
  let n = colIndex;

  while (n >= 0) {
    column = String.fromCharCode(65 + (n % 26)) + column;
    n = Math.floor(n / 26) - 1;
  }

  return column;
};

export const getCellId = (row: number, col: number): string => {
  return `${getColumnName(col)}${row + 1}`;
};