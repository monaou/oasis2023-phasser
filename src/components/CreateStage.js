import React from 'react';
import StageManager from './StageManager';
import StageDataToJson from './StageDataToJson';

const CreateStage = () => {
    return (
        <div className="create-stage-container">
            <StageManager />
            <StageDataToJson />
        </div>
    );
};

export default CreateStage;
