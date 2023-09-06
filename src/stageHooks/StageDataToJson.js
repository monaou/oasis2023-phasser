import React, { useState } from 'react';

const StageDataToJson = ({ stageData }) => {
    const [jsonData, setJsonData] = useState('');

    const createJson = () => {
        if (!stageData || !Array.isArray(stageData)) {
            return; // stageData が不正な場合、処理をスキップ
        }

        const jsonList = [];
        const height = stageData.length; // グリッドの高さ

        for (let y = 0; y < height; y++) {
            const row = stageData[y];
            if (!row || !Array.isArray(row)) {
                continue;
            }

            for (let x = 0; x < row.length; x++) {
                const cellValue = stageData[y][x];
                if (cellValue) {  // objectID が存在する場合のみ追加
                    jsonList.push({
                        x: x,
                        y: height - y - 1, // 一番左下を (0,0) とするために高さから引く
                        objectID: cellValue
                    });
                }
            }
        }

        const newJsonData = JSON.stringify(jsonList, null, 2);
        setJsonData(newJsonData);
    };



    return (
        <div>
            <h2>Stage Data to Json</h2>
            <button onClick={createJson}>Create Json</button>
            <div>
                <h3>JSON Data</h3>
                <textarea readOnly value={jsonData} rows="10" cols="30" />
            </div>
        </div>
    );
};

export default StageDataToJson;
