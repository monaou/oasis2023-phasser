// recordGame.js
const { validateGameInstance, recordAction } = require('../utils/gameFunctions');

module.exports = async (req, res) => {
    try {
        const { tokenId, gameInstanceId, actionType } = req.body;

        // Validate the game instance ID
        if (!validateGameInstance(tokenId, gameInstanceId)) {
            throw new Error('Invalid game instance ID or game has expired');
        }

        // Record the action with a timestamp
        recordAction(tokenId, gameInstanceId, actionType);

        res.status(200).send({ message: 'Action recorded successfully' });
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).send(error.message);
    }
};
