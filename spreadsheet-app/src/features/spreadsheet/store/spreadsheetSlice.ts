import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CellData, CellSelection, CellPosition } from '../../../shared/types';
import { evaluateFormula } from '../../../shared/utils/formulas';

interface SpreadsheetState {
  cells: Record<string, CellData>;
  selection: CellPosition | null;
  rangeSelection: CellSelection | null;
}

const initialState: SpreadsheetState = {
  cells: {},
  selection: { row: 0, col: 0 },
  rangeSelection: null,
};

const recalculateFormulas = (cells: Record<string, CellData>): Record<string, CellData> => {
  const newCells = { ...cells };
  let hasChanges = true;
  let iterations = 0;
  const maxIterations = 100;

  while (hasChanges && iterations < maxIterations) {
    hasChanges = false;
    iterations++;

    Object.keys(newCells).forEach(cellId => {
      const cell = newCells[cellId];
      const formula = cell.formula || (cell.value && cell.value.toString().startsWith('=') ? cell.value.toString() : null);

      if (formula) {
        const result = evaluateFormula(formula, newCells);
        if (String(result) !== String(cell.value)) {
          newCells[cellId] = { ...cell, value: result, formula };
          hasChanges = true;
        }
      }
    });
  }

  return newCells;
};

export const spreadsheetSlice = createSlice({
  name: 'spreadsheet',
  initialState,
  reducers: {
    updateCell: (state, action: PayloadAction<{ id: string; data: Partial<CellData> }>) => {
      const { id, data } = action.payload;

      if (!state.cells[id]) {
        state.cells[id] = { value: null, formatting: {} };
      }

      let needsRecalculation = false;

      if (data.value !== undefined) {
        const valueStr = String(data.value).trim();

        if (valueStr.startsWith('=')) {
          state.cells[id] = { ...state.cells[id], formula: valueStr, value: null };
          needsRecalculation = true;
        } else {
          state.cells[id] = { ...state.cells[id], value: data.value, formula: undefined };
          needsRecalculation = true;
        }
      }

      if (data.formula !== undefined) {
        state.cells[id] = { ...state.cells[id], formula: data.formula };
        needsRecalculation = true;
      }

      if (needsRecalculation) {
        state.cells = recalculateFormulas(state.cells);
      }
    },

    selectCell: (state, action: PayloadAction<CellPosition>) => {
      state.selection = action.payload;
      state.rangeSelection = null;
    },

    selectRange: (state, action: PayloadAction<CellPosition>) => {
      if (!state.selection) return;
      state.rangeSelection = { start: state.selection, end: action.payload };
    },

    clearCell: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      if (state.cells[id]) {
        delete state.cells[id];
        state.cells = recalculateFormulas(state.cells);
      }
    },
  },
});

export const { updateCell, selectCell, selectRange, clearCell } = spreadsheetSlice.actions;
export default spreadsheetSlice.reducer;