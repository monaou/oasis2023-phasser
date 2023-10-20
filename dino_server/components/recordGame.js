// recordGame.js
const { validateStage, recordAction, validateGame, validateAction } = require('../utils/verify');

module.exports = async (req, res) => {
    try {
        const { stageId, gameInstanceId, actionType } = req.body;

        // Validate the game instance ID
        const is_validate = await validateGame(stageId, gameInstanceId)
        if (!is_validate) {
            throw new Error('Invalid game instance ID or game has expired');
        }

        // Record the action with a timestamp
        console.log("ecordAction:", stageId, gameInstanceId, actionType)
        await recordAction(stageId, gameInstanceId, actionType);

        res.status(200).send({ message: 'Action recorded successfully' });
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).send(error.message);
    }
};
