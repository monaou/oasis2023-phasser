import React, { useState, useRef, useEffect } from 'react';
import StageSettings from './StageSettings';
import StageBuilder from './StageBuilder';
import ObjectDisplay from './ObjectDisplay';

import './StageManager.css'; // 必要なCSSファイルをインポート

const StageManager = () => {
    const [selectedObject, setSelectedObject] = useState(null);
    const [copiedObject, setCopiedObject] = useState(null);
    const stageRef = useRef();

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
            <StageSettings />
            <StageBuilder selectedObject={selectedObject} />
            <ObjectDisplay selectedObject={selectedObject} setSelectedObject={setSelectedObject} />
        </div>
    );
};

export default StageManager;