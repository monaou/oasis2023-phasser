// gameFunctions.js
const {
    ethers,
    contract,
    connectedWallet,
    provider,
    gameInstanceFlags,
} = require('../sharedResources/sharedResources');

function initializeGameInstance(tokenId, gameInstanceId) {
    const key = `${tokenId}-${gameInstanceId}`;
    console.log(key)
    gameInstanceFlags[key] = { isActive: true, actions: [], startTime: Date.now() };

    // 1時間後にステータスを変更
    setTimeout(() => {
        setStageFailed(tokenId, gameInstanceId)
    }, 3600000);
}

async function setStageFailed(tokenId, gameInstanceId) {
    try {
        if (!validateGameInstance(tokenId, gameInstanceId)) {
            throw new Error('Invalid game instance ID or game has expired');
        }
        const key = `${tokenId}-${gameInstanceId}`;
        if (gameInstanceFlags[key]) {
            gameInstanceFlags[key].isActive = false;
        }
        const nonce = await connectedWallet.provider.getTransactionCount(connectedWallet.address, 'pending');

        // Prepare the transaction data
        const txData = {
            to: contract.address,
            data: contract.interface.encodeFunctionData('setStageFailed', [tokenId, gameInstanceId]),
            gasPrice: ethers.utils.parseUnits('10', 'gwei'),
            gasLimit: ethers.BigNumber.from(100000),
            nonce  // Setting the nonce explicitly
        };

        const signedTx = await connectedWallet.signTransaction(txData);

        // Send the signed transaction
        const txResponse = await connectedWallet.provider.sendTransaction(signedTx);

        // Wait for the transaction to be confirmed
        const receipt = await txResponse.wait();
    } catch (error) {
        console.error('Error:', error.message);
    }
}

function recordAction(tokenId, gameInstanceId, actionType) {
    const key = `${tokenId}-${gameInstanceId}`;
    if (gameInstanceFlags[key]) {
        gameInstanceFlags[key].actions.push({ type: actionType, timestamp: Date.now() });
    }
}

function getGameInstanceStatus(tokenId, gameInstanceId) {
    const key = `${tokenId}-${gameInstanceId}`;
    return gameInstanceFlags[key];
}

function validateGameInstance(tokenId, gameInstanceId) {
    const key = `${tokenId}-${gameInstanceId}`;
    console.log(key)
    if (gameInstanceFlags[key]) {
        return gameInstanceFlags[key].isActive;
    }
    return false;
}

function validateActionExistence(tokenId, gameInstanceId) {
    const key = `${tokenId}-${gameInstanceId}`;
    if (gameInstanceFlags[key]) {
        if (gameInstanceFlags[key].isActive) {
            gameInstanceFlags[key].isActive = false
            return gameInstanceFlags[key].actions.length > 0;
        }
    }
    return false;
}

module.exports = { initializeGameInstance, setStageFailed, getGameInstanceStatus, recordAction, validateGameInstance, validateActionExistence };
