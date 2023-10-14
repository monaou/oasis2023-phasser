import React, { useState } from 'react';
import objectTypesData from '../shared_json/objectTypes.json';
import objectsData from '../shared_json/objects.json';
import './ObjectDisplay.css';

const ObjectDisplay = ({ selectedObject, setSelectedObject }) => {
    const [selectedObjectType, setSelectedObjectType] = useState(objectTypesData[0].objectType);
    const selectedObjects = objectsData.filter(object => object.objectType === selectedObjectType);

    const handleObjectTypeChange = (type) => {
        setSelectedObjectType(type.objectType);
        setSelectedObject(null);
    };

    const handleObjectClick = (object) => {
        setSelectedObject(object);
    };

    return (
        <div className="object-display-container">
            <div className="object-types">
                {objectTypesData.map((type) => (
                    <button
                        key={type.objectType}
                        onClick={() => handleObjectTypeChange(type)}
                        className={`button ${selectedObjectType === type.objectType ? 'selected' : ''}`}
                    >
                        {type.displayName}
                    </button>
                ))}
            </div>
            <div className="selected-objects">
                {selectedObjects.map((object) => (
                    <div
                        key={object.objectID}
                        onClick={() => handleObjectClick(object)}
                        className={`object-item ${selectedObject === object ? 'selected' : ''}`}
                    >
                        <p>{object.objectName}</p>
                        <p>{object.objectCell}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ObjectDisplay;
