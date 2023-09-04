import React from 'react';

const SaveButtons = ({ onSave, onTempSave }) => {
    return (
        <div className="save-buttons">
            <button onClick={onSave}>Save</button>
            <button onClick={onTempSave}>Temp Save</button>
        </div>
    );
};

export default SaveButtons;
