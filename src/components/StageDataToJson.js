import React, { useState } from 'react';

const StageDataToJson = ({ stageData }) => {
    const [jsonData, setJsonData] = useState('');

    const createJson = () => {
        const jsonList = [];
        for (let y = 0; y < stageData.length; y++) {
            for (let x = 0; x < stageData[y].length; x++) {
                const cellValue = stageData[y][x];
                if (cellValue) {
                    jsonList.push({
                        x: x + 1,
                        y: y + 1,
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
