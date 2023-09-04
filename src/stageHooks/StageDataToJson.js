import React from 'react';

const StageDataToJson = ({ stageData }) => {
    const handleToJson = () => {
        const stageJson = JSON.stringify(stageData, null, 2);
        console.log(stageJson);
    };

    return (
        <div>
            <h2>Convert JSON</h2>
            <button onClick={handleToJson}>Convert</button>
        </div>
    );
};

export default StageDataToJson;
