import React, { useState, useEffect } from 'react';

function CreateStage(props) {
    const [selectedObject, setSelectedObject] = useState(null);
    const [selectedCell, setSelectedCell] = useState(null);
    const [rows, setRows] = useState(16);
    const [cols, setCols] = useState(16);
    const [category, setCategory] = useState('Enemy');
    const defaultGrid = Array(rows).fill().map((_, rowIndex) =>
        Array(cols).fill((rowIndex >= rows - 2) ? 'A' : null)
    );
    const [grid, setGrid] = useState(defaultGrid);
    const [stageJson, setStageJson] = useState('');

    const objectsByCategory = {
        'Enemy': [
            { name: 'Enemy_a', color: 'red' },
            { name: 'Enemy_b', color: 'blue' },
            { name: 'Enemy_Boss', color: 'green' }
        ],
        'Stage': [
            { name: '1', color: 'yellow' },
            { name: '2', color: 'purple' },
            { name: '3', color: 'cyan' }
        ]
    };

    // Delete or Esc key
    const handleKeyUp = (event) => {
        if (event.key === "Delete" || event.key === "Escape") {
            setSelectedObject(null);
        }
    }

    useEffect(() => {
        window.addEventListener('keyup', handleKeyUp);
        return () => {
            window.removeEventListener('keyup', handleKeyUp);
        }
    }, []);

    const handleObjectClick = (objectName) => {
        setSelectedObject(objectName);
    }

    const handleCellClick = (rowIndex, colIndex) => {
        if (selectedObject) {
            const newGrid = [...grid];
            newGrid[rowIndex][colIndex] = selectedObject;
            setGrid(newGrid);
        }
        setSelectedCell({ rowIndex, colIndex });
    }

    const generateStageJson = () => {
        const json = grid.flatMap((row, rowIndex) => {
            return row.map((cell, colIndex) => {
                if (cell) {
                    return {
                        x: colIndex.toString(),
                        y: rowIndex.toString(),
                        sizeX: "90",
                        sizeY: "90",
                        type: cell
                    };
                }
                return null;
            }).filter(item => item !== null);
        });
        setStageJson(JSON.stringify(json, null, 2));
    }

    const generateStage = () => {
        const newGrid = Array(Number(rows)).fill().map((_, rowIndex) =>
            Array(Number(cols)).fill((rowIndex >= Number(rows) - 2) ? 'A' : null)
        );
        setGrid(newGrid);
    }

    const getColorForObject = (objectName) => {
        // すべてのカテゴリーからオブジェクトを検索し、そのカラーを返す
        for (const category in objectsByCategory) {
            const object = objectsByCategory[category].find(obj => obj.name === objectName);
            if (object) return object.color;
        }
        return 'white'; // デフォルトの背景色
    }

    const [copying, setCopying] = useState(false);
    const [copiedObject, setCopiedObject] = useState(null);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (selectedCell) {
                const { rowIndex, colIndex } = selectedCell;

                switch (e.code) {
                    case 'ArrowRight':
                        setSelectedCell({ rowIndex, colIndex: Math.min(colIndex + 1, cols - 1) });
                        break;
                    case 'ArrowLeft':
                        setSelectedCell({ rowIndex, colIndex: Math.max(colIndex - 1, 0) });
                        break;
                    case 'ArrowUp':
                        setSelectedCell({ rowIndex: Math.max(rowIndex - 1, 0), colIndex });
                        break;
                    case 'ArrowDown':
                        setSelectedCell({ rowIndex: Math.min(rowIndex + 1, rows - 1), colIndex });
                        break;
                    case 'KeyC':
                        if (e.ctrlKey) {
                            setCopying(true);
                            setCopiedObject(grid[rowIndex][colIndex]);
                            setSelectedObject(null);
                        }
                        break;
                    case 'KeyV':
                        if (e.ctrlKey && copying) {
                            const newGrid = [...grid];
                            newGrid[rowIndex][colIndex] = copiedObject;
                            setGrid(newGrid);
                        }
                        break;
                    case 'Escape':
                        setCopying(false);
                        setCopiedObject(null);
                        break;
                    default:
                        break;
                }
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [selectedCell, grid, rows, cols, copying]);


    return (
        <div style={{ marginBottom: '20px' }}>
            {/* Grid Size Inputs */}
            <div>
                <input value={rows} onChange={(e) => setRows(e.target.value)} placeholder="Rows" />
                <input value={cols} onChange={(e) => setCols(e.target.value)} placeholder="Cols" />
                <button onClick={generateStage}>Create Stage</button>
            </div>

            {/* Grid and Object Selector */}
            <div style={{ display: 'flex', marginTop: '20px' }}>
                {/* Grid */}
                <div style={{ border: '1px solid black', marginRight: '20px' }}>
                    {grid.map((row, rowIndex) => (
                        <div key={rowIndex} style={{ display: 'flex' }}>
                            {row.map((cell, colIndex) => (
                                <div
                                    key={colIndex}
                                    onClick={() => handleCellClick(rowIndex, colIndex)}
                                    style={{
                                        width: '30px',
                                        height: '30px',
                                        border: selectedCell && selectedCell.rowIndex === rowIndex && selectedCell.colIndex === colIndex ? (copying ? '3px dashed yellow' : '3px solid yellow') : '1px solid gray',
                                        cursor: 'pointer',
                                        backgroundColor: cell ? getColorForObject(cell) : 'white',
                                    }}>
                                    {cell}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>

                {/* Object selector */}
                <div style={{ backgroundColor: 'white', padding: '10px' }}>
                    {/* Category Selector */}
                    <div style={{ marginBottom: '20px' }}>
                        <select value={category} onChange={(e) => {
                            setCategory(e.target.value);
                            setSelectedObject(null);
                        }}>
                            <option value="Enemy">Enemy</option>
                            <option value="Stage">Stage</option>
                        </select>
                    </div>

                    {objectsByCategory[category].map((object, index) => (
                        <div
                            key={index}
                            onClick={() => handleObjectClick(object.name)}
                            style={{
                                display: 'inline-block',
                                padding: '10px',
                                margin: '0 10px',
                                border: selectedObject === object.name ? '3px solid black' : '1px solid black',
                                cursor: 'pointer',
                                backgroundColor: object.color,
                                color: 'white'
                            }}>
                            {object.name}
                        </div>
                    ))}
                </div>
            </div>

            {/* Stage JSON Creator */}
            <div style={{ marginTop: '20px' }}>
                <button onClick={generateStageJson}>Stage Json Create</button>
                <textarea value={stageJson} readOnly style={{ width: '100%', height: '200px', marginTop: '10px' }}></textarea>
            </div>
        </div>
    )
}

export default CreateStage;