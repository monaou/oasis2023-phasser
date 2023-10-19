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
        const receipt = await RewardPoolContract.stakeReward(userAddress, name, imageURL, description,
            needTicketId, needTicketNum, rewardTicketId, rewardTicketNum, extraDataArr);
        console.log("Success: mint");

        res.status(200).send("Success : mint stage");

    } catch (error) {
        console.error('Error:', error.message);
        res.status(400).send(error.message);
    }
};