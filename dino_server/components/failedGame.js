const { setStageFailed } = require('../utils/gameFunctions');

module.exports = async (req, res) => {
    try {
        const { tokenId, gameInstanceId } = req.body;
        setStageFailed(tokenId, gameInstanceId)
        res.status(200).send({ message: 'Falied game successfully' });
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).send(error.message);
    }
};