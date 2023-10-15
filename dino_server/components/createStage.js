const {
    ethers,
    RewardPoolContract,
    StageContract,
    TicketPlatformContract
} = require('../sharedResources/sharedResources');
const { validateStage } = require('../utils/verify');

module.exports = async (req, res) => {
    const { userAddress, name, description,
        needTicketId, needTicketNum, rewardTicketId, rewardTicketNum, extraDataArr } = req.body;
    const imageURL = "https://bafybeie5l4nwfz3rt5kvfuafsz5obiwmfz2artg3vsihowheuyox3yvtry.ipfs.w3s.link/player_ticket.png";
    const is_stage_check = validateStage();
    if (!is_stage_check) {
        return;
    }
    try {
        const burnTicketTx = await TicketPlatformContract.burnTicket(userAddress, rewardTicketId, rewardTicketNum);
        await burnTicketTx.wait();

        const is_ticket_burn = await new Promise((resolve) => {
            TicketPlatformContract.once('TicketBurned', (addr, ticketId, ticketNum, success) => {
                resolve(success);
            });
        });
        console.log("is_ticket_burn", is_ticket_burn)
        if (is_ticket_burn) {
            const mintStage_tx = await StageContract.mintStage(userAddress, name, imageURL, description,
                needTicketId, needTicketNum, rewardTicketId, rewardTicketNum, extraDataArr);
            await mintStage_tx.wait();
            const newStageId = await new Promise((resolve) => {
                StageContract.once('MinStageIdEvent', (stageId, success) => {
                    resolve(stageId);
                });
            });

            console.log("newStageId", newStageId)
            const receipt = await RewardPoolContract.stakeReward(userAddress, newStageId);

            res.status(200).send("Succsess : mint stage ");
        }
    } catch (error) {
        console.error('Error:', error.message);
        res.status(400).send(error.message);
    }
};