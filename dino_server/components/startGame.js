const {
    provider,
    contractInterface
} = require('../sharedResources/sharedResources');
const { initializeGameInstance } = require('../utils/gameFunctions');
const verifyTransaction = require('../utils/verify');
module.exports = async (req, res) => {
    const { tokenId, receipt } = req.body;

    try {
        // check signedTx
        await verifyTransaction(receipt);

        const events = receipt.logs.map(log => {
            try {
                return contractInterface.parseLog(log);
            } catch (error) {
                // Log could not be parsed; it's probably from a different contract
                return null;
            }
        }).filter(event => event !== null);

        // return game instance
        const event = events.find(event => event.name === 'StakeEntreeFeeEvent');
        if (!event) {
            throw new Error('StakeEntreeFeeEvent not found');
        }

        // gameinstacnce initialize
        initializeGameInstance(tokenId, event.args.gameInstanceId);

        res.status(200).send({ gameInstanceId: event.args.gameInstanceId, stage_data: event.args.extraDataArr });
    } catch (error) {
        console.error('Error:', error.message);
        res.status(400).send(error.message);
    }
};