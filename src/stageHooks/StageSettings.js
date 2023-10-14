import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import TicketPlatform from "../shared_json/TicketPlatform.json";
import { createStage } from '../api/interface';
import './StageSettings.css';

function StageSettings({ cellData, address, provider }) { // 関数名を変更
    const [errorMessage, setErrorMessage] = useState(null);
    const [stageName, setStageName] = useState('');
    const [description, setDescription] = useState('');
    const [needTicketId, setNeedTicketId] = useState(1);
    const [needTicketNum, setNeedTicketNum] = useState(1);
    const [rewardTicketId, setRewardTicketId] = useState(2);
    const [inputRewardTicketNum, setInputRewardTicketNum] = useState(0);
    const [rewardTicketNum, setRewardTicketNum] = useState(1);
    const contract = new ethers.Contract(TicketPlatform.address, TicketPlatform.abi, provider);

    useEffect(() => {
        const fetchTicketInfos = async () => {
            try {
                if (address) {
                    let num = await contract.getUserTicket(address, rewardTicketId);
                    setInputRewardTicketNum(num.toNumber())
                }
            } catch (error) {
                console.error("Error fetching ticket data: ", error);
                setErrorMessage("Failed to load ticket information. Please try again later.");
            }
        }

        fetchTicketInfos();
    }, [contract, address]);

    const handleSave = async () => {
        try {
            await createStage(stageName, description, needTicketId, needTicketNum, rewardTicketId, rewardTicketNum, cellData);
            console.log('Data has been saved successfully');
        } catch (err) {
            console.error("An error occurred while saving the data", err);
        }
    };

    const handleTempSave = () => {
        // 一時保存処理をここに書く
    };

    const validateRewardTicketNum = () => {
        if (rewardTicketNum > inputRewardTicketNum) {
            setRewardTicketNum(inputRewardTicketNum);
        }
    };

    return (
        <div className="stage-settings-container">
            <h3>Stage Settings</h3>
            <table className="settings-table">
                <tbody>
                    <tr>
                        <td>Stage Name</td>
                        <td><input className="setting-input" type="text" value={stageName} onChange={(e) => setStageName(e.target.value)} placeholder="Enter stage name" /></td>
                    </tr>
                    <tr>
                        <td>Description</td>
                        <td><input className="setting-input" type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Enter Description" /></td>
                    </tr>
                    <tr>
                        <td>Player Ticket</td>
                        <td><input className="setting-input" type="number" value={needTicketNum} onChange={(e) => setNeedTicketNum(e.target.value)} placeholder="Enter number" /></td>
                    </tr>
                    <tr>
                        <td>Creater Ticket(you must own)</td>
                        <td>
                            <input
                                className="setting-input"
                                type="number"
                                value={rewardTicketNum}
                                onChange={(e) => setRewardTicketNum(e.target.value)}
                                onBlur={validateRewardTicketNum} // フォーカスが外れたときに検証
                                placeholder="Enter number"
                            />
                        </td>
                    </tr>

                </tbody>
            </table>
            <div className="save-buttons">
                <button onClick={handleSave}>Save</button>
                <button onClick={handleTempSave}>Temp Save</button>
            </div>
        </div>
    );

};

export default StageSettings;
