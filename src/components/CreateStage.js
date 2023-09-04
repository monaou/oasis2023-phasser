import React from 'react';
<<<<<<< HEAD
import StageManager from './StageManager';
=======
import StageManager from './../stageHooks/StageManager';
import StageDataToJson from './../stageHooks/StageDataToJson';
>>>>>>> 0c3b8297c2ef1a546436b7155c43c0836e765de6

const CreateStage = (address, provider) => {
    return (
        <div className="create-stage-container">
<<<<<<< HEAD
            <StageManager />
=======
            <StageManager provider={provider} />
            {/* <StageDataToJson /> */}
>>>>>>> 0c3b8297c2ef1a546436b7155c43c0836e765de6
        </div>
    );
};

export default CreateStage;
