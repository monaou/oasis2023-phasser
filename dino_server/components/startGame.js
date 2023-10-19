const { RewardPoolContract } = require('../sharedResources/sharedResources');
const { recordAction } = require('../utils/verify');

module.exports = async (req, res) => {
    const { userAddress, stageId } = req.body;

    try {
        console.log("Attempting to stake entry fee...", userAddress, stageId);

        const tx = await RewardPoolContract.stakeEntreeFee(userAddress, stageId);
        const receipt = await tx.wait();

        console.log("Success: play");

        if (!receipt.events) {
            console.log("No events in the receipt");
            throw new Error('No events found in the receipt');
        }

        const events = receipt.events.filter(e => e.event === 'StakeEntreeFeeEvent');

        console.log(`Found ${events.length} StakeEntreeFeeEvent events`);

        if (events.length === 0) {
            throw new Error('StakeEntreeFeeEvent not found');
        }

        const event = events[0];

        console.log("Initializing game instance...");
        await recordAction(stageId, event.args.gameInstanceId.toString(), 10);
        console.log("Game instance initialized successfully");

        res.status(200).send({ gameInstanceId: event.args.gameInstanceId, stage_data: event.args.extraDataArr });
    } catch (error) {
        console.error('Error:', error.message);
        res.status(400).send(error.message);
    }
};
