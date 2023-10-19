const {
    ethers,
    contract,
    connectedWallet
} = require('../sharedResources/sharedResources');
const { validateAction } = require('../utils/gameFunctions');

module.exports = async (req, res) => {
    try {
        const { stageId, gameInstanceId } = req.body;

        // Validate the start flag for the given game instance ID
        const is_validate = await validateGame(stageId, gameInstanceId)
        if (!is_validate) {
            throw new Error('Invalid game instance ID or game has expired');
        }
        const nonce = await connectedWallet.provider.getTransactionCount(connectedWallet.address, 'pending');

        // Prepare the transaction data
        const txData = {
            to: contract.address,
            data: contract.interface.encodeFunctionData('setStageClear', [stageId, gameInstanceId]),
            gasPrice: ethers.utils.parseUnits('10', 'gwei'),
            gasLimit: ethers.BigNumber.from(100000),
            nonce  // Setting the nonce explicitly
        };

        const signedTx = await connectedWallet.signTransaction(txData);

        // Send the signed transaction
        const txResponse = await connectedWallet.provider.sendTransaction(signedTx);

        // Wait for the transaction to be confirmed
        const receipt = await txResponse.wait();

        res.status(200).send({ message: 'Clear game successfully' });
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).send(error.message);
    }
};
