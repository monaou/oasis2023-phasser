const {
    RewardPoolContract,
    StageContract,
    TicketPlatformContract
} = require('../sharedResources/sharedResources');
const { initializeGame } = require('../utils/verify');

module.exports = async (req, res) => {
    const { stageId, userAddress } = req.body;

    try {
        const stage_data = await StageContract.getStageDetails(stageId);
        const is_ticket_burn = await TicketPlatformContract.burnTicket(userAddress, stage_data.needTicketId, stage_data.needTicketNum);

        if (is_ticket_burn) {
            const receipt = await RewardPoolContract.stakeEntreeFee(userAddress, stageId);
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
            initializeGame(stageId, event.args.gameInstanceId);

            res.status(200).send({ gameInstanceId: event.args.gameInstanceId, stage_data: event.args.extraDataArr });
        }
    } catch (error) {
        console.error('Error:', error.message);
        res.status(400).send(error.message);
    }
};