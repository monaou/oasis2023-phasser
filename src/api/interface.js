const BACKEND_HOST = 'localhost';
const BACKEND_POST = 3000;
const BASE_URL = `http://${BACKEND_HOST}:${BACKEND_POST}`;

// Start-game interaction
export async function createStage(addr, name, description,
    needTicketId, needTicketNum, rewardTicketId, rewardTicketNum, extraDataArr) {
    const userAddress = addr;
    try {
        const response = await fetch(`${BASE_URL}/create-stage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userAddress, name, description,
                needTicketId, needTicketNum, rewardTicketId, rewardTicketNum, extraDataArr
            }),
        });

        console.log(response)
    } catch (error) {
        console.error('Error:', error.message);
    }
}

// Start-game interaction
export async function startGame(addr, stageId) {
    const userAddress = addr;
    try {
        const response = await fetch(`${BASE_URL}/start-game`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userAddress, stageId }),
        });

        const responseData = await response.json();  // ここで一度だけjson()を呼び出す
        const stage_data = responseData.stage_data;
        const gameInstanceIdObj = responseData.gameInstanceId;
        return { stage_data, gameInstanceIdObj };  // 修正された戻り値
    } catch (error) {
        console.error('Error:', error.message);
    }
}

// Record-action interaction
export function recordAction(stageId, gameInstanceId, actionType) {
    // fetch処理を非同期関数として実行
    async function sendRequest() {
        try {
            const response = await fetch(`${BASE_URL}/record-game`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ stageId, gameInstanceId, actionType }),
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
export function clearGame(stageId, gameInstanceId) {
    // 定義した非同期関数
    async function sendRequest() {
        try {
            const response = await fetch(`${BASE_URL}/clear-game`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ stageId, gameInstanceId }),
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
export function FailedGame(stageId, gameInstanceId) {
    // 定義した非同期関数
    async function sendRequest() {
        try {
            const response = await fetch(`${BASE_URL}/failed-game`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ stageId, gameInstanceId }),
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