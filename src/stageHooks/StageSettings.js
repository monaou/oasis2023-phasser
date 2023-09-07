import React, { useState } from 'react';
import { ethers } from 'ethers';
import rewardContract from '../shared_json/RewardPool.json';
import { ERC20_ABI } from '../shared_json/Erc20_abi';
import currency from '../shared_json/currency.json';
import SaveButtons from './SaveButtons';
import './StageSettings.css';

const MIN_TIME_LIMIT = 10;
const MAX_TIME_LIMIT = 300;
const TIME_STEP = 5;

const StageSettings = ({ cellData, provider }) => {
    const [timeLimit, setTimeLimit] = useState(60);
    const [stageName, setStageName] = useState('');
    const [entryFee, setEntryFee] = useState();
    const [incentive, setIncentive] = useState();

    const handleSave = async () => {
        const { ethereum } = window;

        if (!ethereum) {
            console.error("No web3 provider detected");
            return;
        }
        const provider = new ethers.providers.Web3Provider(ethereum);
        if (!provider) {
            console.log("No provider is set");
            return;
        }
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(rewardContract.address, rewardContract.abi, signer);

        // Convert the JSON string from textarea to an array of objects
        const transformedArray = Object.keys(cellData).map(key => {
            const [x, y] = key.split('-').map(Number);
            return [x * 80, y * 80, cellData[key]];//TODO: fix magic number
        });

        const incentiveValue = (Number(incentive) * 1000000).toString();
        const oasContract = new ethers.Contract(currency.sandverse, ERC20_ABI, signer);  // NOTE: ERC20トークンのABIにはapproveメソッドが含まれている必要があります
        try {
            const tx = await oasContract.approve(rewardContract.address, ethers.utils.parseUnits(incentiveValue, 6));  // USDCは小数点以下6桁なので、6を指定
            await tx.wait();
            console.log("Allowance set successfully");
        } catch (err) {
            console.error("An error occurred while setting the allowance", err);
        }

        try {
            const tx = await contract.stakeReward(stageName, Number(entryFee * 1000000), Number(incentive * 1000000), transformedArray);
            await tx.wait();
            console.log('Data has been saved successfully', { stageName, transformedArray });
        } catch (err) {
            console.error("An error occurred while saving the data", err);
        }
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
                        <td><input type="text" value={stageName} onChange={(e) => setStageName(e.target.value)} placeholder="Enter stage name" /></td>
                    </tr>
                    <tr>
                        <td>Entry Fee:</td>
                        <td><input type="text" value={entryFee} onChange={(e) => setEntryFee(e.target.value)} placeholder="Enter entry fee" /></td>
                    </tr>
                    <tr>
                        <td>Incentive:</td>
                        <td><input type="text" value={incentive} onChange={(e) => setIncentive(e.target.value)} placeholder="Enter incentive" /></td>
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
                                    .map(time => <option key={time} value={time}>{time} </option>)}
                            </select>
                            seconds
                        </td>
                    </tr>
                </tbody>
            </table>
            <SaveButtons onSave={handleSave} onTempSave={handleTempSave} />
        </div>
    );
};

export default StageSettings;
