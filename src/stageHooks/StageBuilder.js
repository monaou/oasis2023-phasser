import React, { useState, useContextMenu } from 'react';
import './StageBuilder.css';

const MAX_ROWS = 64;
const MAX_COLS = 128;
const STEP = 16;

const StageBuilder = ({ stageData, setStageData, selectedObject }) => {
    const [selectedCell, setSelectedCell] = useState(null);
    const [cellData, setCellData] = useState({});
    const [copiedCell, setCopiedCell] = useState(null);

    const [rows, setRows] = useState(16);
    const [cols, setCols] = useState(32);

    const handleClick = (row, col) => {
        setSelectedCell({ row, col });
        if (selectedObject) {
            const newStageData = [...stageData];
            if (!newStageData[row]) {
                newStageData[row] = [];
            }
            newStageData[row][col] = selectedObject.objectCell;
            setStageData(newStageData);
            const newCellData = { ...cellData, [`${row}-${col}`]: selectedObject.objectCell };
            setCellData(newCellData);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Escape') {
            setSelectedCell(null);
            setCopiedCell(null);
        } else if (selectedCell) {
            if (e.key === 'ArrowUp') moveCell(-1, 0);
            else if (e.key === 'ArrowDown') moveCell(1, 0);
            else if (e.key === 'ArrowLeft') moveCell(0, -1);
            else if (e.key === 'ArrowRight') moveCell(0, 1);
            else if (e.ctrlKey && e.key === 'c') copyCell();
            else if (e.ctrlKey && e.key === 'v') pasteCell();
        }
    };

    const moveCell = (rowDiff, colDiff) => {
        if (selectedCell) {
            const newRow = selectedCell.row + rowDiff;
            const newCol = selectedCell.col + colDiff;
            if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols) {
                setSelectedCell({ row: newRow, col: newCol });
            }
        }
    };

    const copyCell = () => {
        if (selectedCell) {
            setCopiedCell(selectedCell);
        }
    };

    const pasteCell = () => {
        if (copiedCell && selectedCell) {
            const newStageData = [...stageData];
            if (!newStageData[selectedCell.row]) {
                newStageData[selectedCell.row] = [];
            }
            newStageData[selectedCell.row][selectedCell.col] = cellData[`${copiedCell.row}-${copiedCell.col}`];

            const newCellData = { ...cellData, [`${selectedCell.row}-${selectedCell.col}`]: cellData[`${copiedCell.row}-${copiedCell.col}`] };
            setCellData(newCellData);

            setStageData(newStageData);
        }
    };


    const generateOptions = (maxValue, step) => {
        const options = [];
        for (let i = step; i <= maxValue; i += step) {
            options.push(<option key={i} value={i}>{i}</option>);
        }
        return options;
    };

    return (
        <div className="stage-builder-container" tabIndex="0" onKeyDown={handleKeyPress}>
            <h2>Stage Builder</h2>
            <div className="controls">
                <select value={rows} onChange={(e) => setRows(Number(e.target.value))}>
                    {generateOptions(MAX_ROWS, STEP)}
                </select>
                <select value={cols} onChange={(e) => setCols(Number(e.target.value))}>
                    {generateOptions(MAX_COLS, STEP)}
                </select>
            </div>
            <div className={`stage-field ${rows > 32 || cols > 64 ? 'scrollable' : ''}`}>
                {[...Array(rows)].map((_, row) =>
                    <div key={row} className="stage-row">
                        {[...Array(cols)].map((_, col) =>
                            <div
                                key={col}
                                className={`stage-cell ${selectedCell && selectedCell.row === row && selectedCell.col === col ? 'selected' : ''} ${copiedCell && copiedCell.row === row && copiedCell.col === col ? 'copied' : ''}`}
                                onClick={() => handleClick(row, col)}
                            >
                                {cellData[`${row}-${col}`] || ''}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default StageBuilder;
