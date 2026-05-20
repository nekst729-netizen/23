import React, { useState } from 'react';
import { useAppSelector, useAppDispatch } from '@/app/store/hooks';
import { selectCell, updateCell } from '@/features/spreadsheet/store/spreadsheetSlice';
import { getCellId, getColumnName } from '@/shared/utils/grid';
import { FormulaBar } from '@/widgets/FormulaBar';
import './SpreadsheetPage.css';

const ROWS = 100;
const COLS = 26;

export const SpreadsheetPage = () => {
  const dispatch = useAppDispatch();
  const { cells, selection } = useAppSelector((state) => state.spreadsheet);
  
  const [editingCellId, setEditingCellId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  const handleCellClick = (row: number, col: number) => {
    dispatch(selectCell({ row, col }));
  };

  const handleDoubleClick = (row: number, col: number) => {
    const cellId = getCellId(row, col);
    setEditingCellId(cellId);
    const cellData = cells[cellId];
    setEditValue(cellData?.value?.toString() || '');
  };

  const handleKeyDown = (e: React.KeyboardEvent, row: number, col: number) => {
    if (e.key === 'Enter') {
      const cellId = getCellId(row, col);
      dispatch(updateCell({ 
        id: cellId, 
        data: { value: editValue }
      }));
      setEditingCellId(null);
      
      if (row < ROWS - 1) {
        dispatch(selectCell({ row: row + 1, col }));
      }
    }
  };

  return (
    <div className="spreadsheet-wrapper">
      {}
      <FormulaBar />
      
      <div className="spreadsheet-container">
        <table className="spreadsheet-table">
          <thead>
            <tr>
              <th className="row-header-corner"></th>
              {Array.from({ length: COLS }).map((_, index) => (
                <th key={index} className="col-header">
                  {getColumnName(index)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: ROWS }).map((_, rowIndex) => (
              <tr key={rowIndex}>
                <td className="row-header">{rowIndex + 1}</td>
                {Array.from({ length: COLS }).map((_, colIndex) => {
                  const cellId = getCellId(rowIndex, colIndex);
                  const isSelected = selection?.row === rowIndex && selection?.col === colIndex;
                  const isEditing = editingCellId === cellId;
                  const cellData = cells[cellId];

                  return (
                    <td
                      key={colIndex}
                      className={`spreadsheet-cell ${isSelected ? 'selected' : ''}`}
                      onClick={() => handleCellClick(rowIndex, colIndex)}
                      onDoubleClick={() => handleDoubleClick(rowIndex, colIndex)}
                    >
                      {isEditing ? (
                        <input
                          autoFocus
                          className="cell-input"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onBlur={() => {
                            dispatch(updateCell({ id: cellId, data: { value: editValue } }));
                            setEditingCellId(null);
                          }}
                          onKeyDown={(e) => handleKeyDown(e, rowIndex, colIndex)}
                        />
                      ) : (
                        cellData?.value || ''
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};