import { ERC20_ABI } from '../shared_json/Erc20_abi';
import currency from '../shared_json/currency.json';
import rewardPool from '../shared_json/RewardPool.json';
import stageContract from '../shared_json/StageContract.json';
import { ethers } from "ethers"

const HOST = 'localhost';
const PORT = 3000;
const BASE_URL = `http://${HOST}:${PORT}`;

// Start-game interaction
export async function startGame(tokenId) {
    const { ethereum } = window;
    if (!ethereum) {
        console.error("No web3 provider detected");
    }
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(rewardPool.address, rewardPool.abi, signer);
    try {
        const tx = await contract.populateTransaction.stakeEntreeFee(tokenId);  // Assume contract is an instance of the contract
        const signedTx = await signer.sendTransaction(tx);
        const receipt = await signedTx.wait();  // トランザクションがマイニングされるのを待つ

        const response = await fetch(`${BASE_URL}/start-game`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ tokenId, receipt }),
        });

        const responseData = await response.json();  // ここで一度だけjson()を呼び出す
        const stage_data = responseData.stage_data;
        const gameInstanceId = responseData.gameInstanceId;
        console.log(gameInstanceId)
        return { stage_data, gameInstanceId };  // 修正された戻り値
    } catch (error) {
        console.error('Error:', error.message);
    }
}

// Record-action interaction
export function recordAction(tokenId, gameInstanceId, actionType) {
    // fetch処理を非同期関数として実行
    async function sendRequest() {
        try {
            const response = await fetch(`${BASE_URL}/record-game`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ tokenId, gameInstanceId, actionType }),
            });
            const result = await response.json();
            console.log(result.message);
        } catch (error) {
            console.error('Error:', error.message);
        }
    }

    // 非同期関数を呼び出し
    sendRequest();
}

// Clear-game interaction
export function clearGame(tokenId, gameInstanceId) {
    // 定義した非同期関数
    async function sendRequest() {
        try {
            const response = await fetch(`${BASE_URL}/clear-game`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ tokenId, gameInstanceId }),
            });
            const result = await response.json();
            console.log(result.message);
        } catch (error) {
            console.error('Error:', error.message);
        }
    }

    // 非同期関数を呼び出し
    sendRequest();
}

// Failed-game interaction
export function FailedGame(tokenId, gameInstanceId) {
    // 定義した非同期関数
    async function sendRequest() {
        try {
            const response = await fetch(`${BASE_URL}/failed-game`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ tokenId, gameInstanceId }),
            });
            const result = await response.json();
            console.log(result.message);
        } catch (error) {
            console.error('Error:', error.message);
        }
    }

    // 非同期関数を呼び出し
    sendRequest();
}