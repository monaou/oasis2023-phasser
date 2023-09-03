import React, { useState } from 'react';
import SaveButtons from './SaveButtons';
import './StageSettings.css';

const MIN_TIME_LIMIT = 10;
const MAX_TIME_LIMIT = 300;
const TIME_STEP = 5;

const StageSettings = ({ setStageTimeLimitProp, setStageNameProp }) => { // 関数名を変更
    const [timeLimit, setTimeLimit] = useState(60);
    const [stageName, setStageName] = useState('My Stage');

    const handleSave = () => {
        // 保存処理をここに書く
    };

    const handleTempSave = () => {
        // 一時保存処理をここに書く
    };

    return (
        <div className="stage-settings-container">
            <h3>Stage Settings</h3>
            <table className="settings-table">
                <tbody>
                    <tr>
                        <td>Stage Name:</td>
                        <td><input type="text" value={stageName} onChange={(e) => setStageName(e.target.value)} /></td>
                    </tr>
                    <tr>
                        <td>Time Limit:</td>
                        <td>
                            <select
                                id="timeLimit"
                                className="setting-select"
                                value={timeLimit}
                                onChange={(e) => setTimeLimit(Number(e.target.value))}
                            >
                                {Array.from({ length: (MAX_TIME_LIMIT - MIN_TIME_LIMIT) / TIME_STEP + 1 }, (_, i) => (i * TIME_STEP) + MIN_TIME_LIMIT)
                                    .map(time => <option key={time} value={time}>{time} seconds</option>)}
                            </select>
                        </td>
                    </tr>
                </tbody>
            </table>
            <SaveButtons onSave={handleSave} onTempSave={handleTempSave} />
        </div>
    );
};

export default StageSettings;
