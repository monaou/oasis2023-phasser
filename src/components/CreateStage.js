import React from 'react';
import StageManager from './../stageHooks/StageManager';
import StageDataToJson from './../stageHooks/StageDataToJson';

const CreateStage = (address, provider) => {
    return (
        <div className="create-stage-container">
            <StageManager provider={provider} />
            {/* <StageDataToJson /> */}
        </div>
    );
};

export default CreateStage;
