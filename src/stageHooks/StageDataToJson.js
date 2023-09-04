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
<<<<<<< HEAD:src/components/StageDataToJson.js
            <h2>Stage Data to Json</h2>
            <button onClick={createJson}>Create Json</button>
            <div>
                <h3>JSON Data</h3>
                <textarea readOnly value={jsonData} rows="10" cols="30" />
            </div>
=======
            <h2>Convert JSON</h2>
            <button onClick={handleToJson}>Convert</button>
>>>>>>> 0c3b8297c2ef1a546436b7155c43c0836e765de6:src/stageHooks/StageDataToJson.js
        </div>
    );
};

export default StageDataToJson;
