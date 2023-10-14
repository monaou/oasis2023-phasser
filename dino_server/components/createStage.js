const {
    RewardPoolContract,
    StageContract,
    TicketPlatformContract
} = require('../sharedResources/sharedResources');
const { validateStage } = require('../utils/gameFunctions');

module.exports = async (req, res) => {
    const { userAddress, name, description,
        needTicketId, needTicketNum, rewardTicketId, rewardTicketNum, extraDataArr } = req.body;
    const imageURL = "";
    const is_stage_check = validateStage();
    if (!is_stage_check) {
        return;
    }
    try {
        const is_ticket_burn = await TicketPlatformContract.burnTicket(userAddress, rewardTicketId, rewardTicketNum);

        if (is_ticket_burn) {
            const newStageId = await StageContract.mintStage(userAddress, name, imageURL, description,
                needTicketId, needTicketNum, rewardTicketId, rewardTicketNum, extraDataArr);
            const receipt = await RewardPoolContract.stakeReward(userAddress, newStageId);

            res.status(200).send("Succsess : mint stage ");
        }
    } catch (error) {
        console.error('Error:', error.message);
        res.status(400).send(error.message);
    }
};