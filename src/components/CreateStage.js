import React from 'react';
import StageManager from './StageManager';
import StageManager from './../stageHooks/StageManager';

const CreateStage = (address, provider) => {
    return (
        <div className="create-stage-container">
            <StageManager />
        </div>
    );
};

export default CreateStage;
