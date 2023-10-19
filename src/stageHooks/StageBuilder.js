import React, { useState } from 'react';
import ObjectDisplay from '../stageHooks/ObjectDisplay';
import './StageBuilder.css';

const MAX_ROWS = 64;
const MAX_COLS = 128;
const STEP = 16;

const StageBuilder = ({ setCellDataParam }) => {
    const [selectedCell, setSelectedCell] = useState(null);
    const [selectedObject, setSelectedObject] = useState(null);
    const [cellData, setCellData] = useState({});
    const [cellDataID, setCellDataID] = useState({});
    const [copiedCell, setCopiedCell] = useState(null);

    const [rows, setRows] = useState(16);
    const [cols, setCols] = useState(32);

    const transformCellData = (cellData) => {
        const transformed = [];
        for (let key in cellData) {
            const [x, y] = key.split('-').map(Number);
            transformed.push({
                x: x,
                y: y,
                _type: cellData[key]
            });
        }
        return transformed;
    };

    const handleClick = (row, col) => {
        console.log("Clicked Cell: ", row, col);
        console.log("Existing cellData: ", cellData);
        setSelectedCell({ row, col });
        if (selectedObject) {
            const pos_row = rows - row;
            const pos_col = col + 1;
            const newCellData = { ...cellData, [`${row}-${col}`]: selectedObject.objectCell };
            const newCellDataID = { ...cellDataID, [`${pos_col}-${pos_row}`]: selectedObject.objectName };
            console.log("New cellData: ", newCellDataID);
            setCellData(newCellData);
            setCellDataID(newCellDataID);
            const transformedCellData = transformCellData(newCellDataID);
            setCellDataParam(transformedCellData);
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
        if (copiedCell) {
            setSelectedCell(copiedCell);
            setCopiedCell(null);
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
            <ObjectDisplay selectedObject={selectedObject} setSelectedObject={setSelectedObject} />
            <div className="controls-message">
                <div className="controls">
                    <select
                        value={rows}
                        onChange={(e) => setRows(Number(e.target.value))}
                    >
                        {generateOptions(MAX_ROWS, STEP)}
                    </select>
                    <select
                        value={cols}
                        onChange={(e) => setCols(Number(e.target.value))}
                    >
                        {generateOptions(MAX_COLS, STEP)}
                    </select>
                </div>
                {!selectedObject ?
                    <p className="selection-message">Please select an object!</p> :
                    <p className="selection-message">Please select a cell!</p>
                }
            </div>
            <div className={`stage-field ${rows > 32 || cols > 64 ? 'scrollable' : ''}`}>
                {[...Array(rows)].map((_, row) =>
                    <div key={row} className="stage-row">
                        {[...Array(cols)].map((_, col) =>
                            <div
                                key={col}
                                className={`stage-cell ${selectedCell && selectedCell.row === row && selectedCell.col === col ? 'selected' : ''} ${selectedObject ? '' : 'highlight'}`}
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
