import React from 'react';

const StageDataToJson = ({ stageData }) => {
    const handleToJson = () => {
        const stageJson = JSON.stringify(stageData, null, 2);
        console.log(stageJson);
    };

    return (
        <div>
            <h2>JSON変換</h2>
            <button onClick={handleToJson}>変換</button>
        </div>
    );
};

export default StageDataToJson;
