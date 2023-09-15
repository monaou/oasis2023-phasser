import React, { useState } from 'react';
import objectTypesData from './objectTypes.json';
import objectsData from './objects.json';

import './ObjectDisplay.css';

const ObjectDisplay = ({ selectedObject, setSelectedObject }) => {
    const [selectedObjectType, setSelectedObjectType] = useState(objectTypesData[0].objectType);
    const selectedObjects = objectsData.filter(object => object.objectType === selectedObjectType);

    const handleObjectTypeChange = (e) => {
        setSelectedObjectType(e.target.value);
        setSelectedObject(null);
    };

    const handleObjectClick = (object) => {
        setSelectedObject(object);
    };

    const handleDeselectObject = () => {
        setSelectedObject(null);
    };

    return (
        <div className="object-display-container">
            {/* <h3>Object Display</h3> */}
            <div className="object-types-select">
                <label htmlFor="object-type-select">Select Object Type:</label>
                <select id="object-type-select" value={selectedObjectType} onChange={handleObjectTypeChange}>
                    {objectTypesData.map((type) => (
                        <option key={type.objectType} value={type.objectType}>{type.displayName}</option>
                    ))}
                </select>
            </div>
            <table className="object-images-table">
                <thead>
                    <tr>
                        <th>Object Name</th>
                        <th>Object Cell</th>
                    </tr>
                </thead>
                <tbody>
                    {selectedObjects.map((object) => (
                        <tr
                            key={object.objectID}
                            onClick={() => handleObjectClick(object)}
                            className={selectedObject === object ? 'selected' : ''}
                        >
                            <td>{object.objectName}</td>
                            <td>{object.objectCell}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="selected-object-details">
                <h4>Selected Object Details</h4>
                {selectedObject ? (
                    <>
                        <p>Object Name: {selectedObject.objectName}</p>
                        <p>Object Cell: {selectedObject.objectCell}</p>
                        <p>Object Type: {selectedObject.objectType}</p>
                        <p>Object Image Path: {selectedObject.objectImagePath}</p>
                        <p>X Cell Size: {selectedObject.xCellSize}</p>
                        <p>Y Cell Size: {selectedObject.yCellSize}</p>
                        <button onClick={handleDeselectObject}>Deselect Object</button>
                    </>
                ) : (
                    <p>Selected Object: Unselected</p>
                )}
            </div>
        </div>
    );
};

export default ObjectDisplay;