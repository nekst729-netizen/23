import React from 'react';
import { useAppSelector, useAppDispatch } from '@/app/store/hooks';
import { updateCell } from '@/features/spreadsheet/store/spreadsheetSlice';
import { getCellId } from '@/shared/utils/grid';
import './FormulaBar.css';

export const FormulaBar = () => {
  const dispatch = useAppDispatch();
  const { cells, selection } = useAppSelector((state) => state.spreadsheet);
  
  const cellId = selection ? getCellId(selection.row, selection.col) : '';
  const cellData = cellId ? cells[cellId] : null;
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (cellId) {
      dispatch(updateCell({
        id: cellId,
        data: { value: e.target.value }
      }));
    }
  };
  
  return (
    <div className="formula-bar">
      <div className="formula-bar__cell-id">{cellId}</div>
      <input
        type="text"
        className="formula-bar__input"
        value={cellData?.formula || cellData?.value || ''}
        onChange={handleChange}
        placeholder="Введите значение или формулу (=SUM(A1:A3))"
      />
    </div>
  );
};