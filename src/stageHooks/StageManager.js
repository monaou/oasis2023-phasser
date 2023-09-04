import React, { useState, useRef, useEffect } from 'react';
import StageSettings from './StageSettings';
import StageBuilder from './StageBuilder';
import ObjectDisplay from './ObjectDisplay';
import StageDataToJson from './StageDataToJson';

import './StageManager.css'; // 必要なCSSファイルをインポート

const StageManager = ({ provider }) => {
    const [selectedObject, setSelectedObject] = useState(null);
    const [copiedObject, setCopiedObject] = useState(null);
    const stageRef = useRef();
<<<<<<< HEAD:src/components/StageManager.js
    const [stageData, setStageData] = useState([
        [null, null, null],
        [null, null, null],
        [null, null, null]
    ]);
=======
    const [celldata, setCellData] = useState([]); // celldataをstateとして追加
>>>>>>> 0c3b8297c2ef1a546436b7155c43c0836e765de6:src/stageHooks/StageManager.js

    useEffect(() => {
        document.addEventListener('keydown', handleKeyPress);

        return () => {
            document.removeEventListener('keydown', handleKeyPress);
        };
    }, []);

    const handleKeyPress = (e) => {
        if (e.key === 'Escape') {
            setSelectedObject(null);
            stageRef.current.blur();
        } else if (e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
            moveSelectedCell(e.key);
        } else if (e.ctrlKey && e.key === 'c') {
            copySelectedCell();
        } else if (e.ctrlKey && e.key === 'v') {
            pasteCopiedCell();
        }
    };

    const moveSelectedCell = (direction) => {
        // セルを移動する処理
    };

    const copySelectedCell = () => {
        // 選択したセルをコピーする処理
    };

    const pasteCopiedCell = () => {
        // コピー中のセルを貼り付ける処理
    };

    return (
        <div className="stage-manager-container" tabIndex="0" ref={stageRef}>
<<<<<<< HEAD:src/components/StageManager.js
            <StageSettings />
            <StageBuilder stageData={stageData} setStageData={setStageData} selectedObject={selectedObject} />
=======
            <StageSettings cellData={celldata} provider={provider} />
            <StageBuilder selectedObject={selectedObject} setCellDataParam={setCellData} />
>>>>>>> 0c3b8297c2ef1a546436b7155c43c0836e765de6:src/stageHooks/StageManager.js
            <ObjectDisplay selectedObject={selectedObject} setSelectedObject={setSelectedObject} />
            <StageDataToJson stageData={stageData} />
        </div>
    );
};

export default StageManager;