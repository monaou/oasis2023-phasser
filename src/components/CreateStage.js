import React, { useState, useRef, useEffect } from 'react';
import StageSettings from '../stageHooks/StageSettings';
import StageBuilder from '../stageHooks/StageBuilder';

import './CreateStage.css'; // 必要なCSSファイルをインポート

function CreateStage({ address, provider }) {
    const [celldata, setCellData] = useState([]); // celldataをstateとして追加

    return (
        <div className="stage-manager-container" tabIndex="0" >
            <StageBuilder setCellDataParam={setCellData} />
            <StageSettings cellData={celldata} address={address} provider={provider} />
        </div>
    );
};

export default CreateStage;
