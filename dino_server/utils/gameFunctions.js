// gameFunctions.js
const {
    ethers,
    contract,
    connectedWallet,
    gameInstanceFlags,
} = require('../sharedResources/sharedResources');
const { validateStage, recordAction, validateGame, validateAction } = require('../utils/verify');

function initializeGame(stageId, gameInstanceId) {
    const key = `${stageId}-${gameInstanceId}`;
    console.log(key)
    gameInstanceFlags[key] = { isActive: true, actions: [], startTime: Date.now() };

    // 1時間後にステータスを変更
    setTimeout(() => {
        setStageFailed(stageId, gameInstanceId)
    }, 3600000);
}

async function setStageFailed(stageId, gameInstanceId) {
    try {
        if (!validateGame(stageId, gameInstanceId)) {
            throw new Error('Invalid game instance ID or game has expired');
        }

        const nonce = await connectedWallet.provider.getTransactionCount(connectedWallet.address, 'pending');

        // Prepare the transaction data
        const txData = {
            to: contract.address,
            data: contract.interface.encodeFunctionData('setStageFailed', [stageId, gameInstanceId]),
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

module.exports = { initializeGame, setStageFailed };
