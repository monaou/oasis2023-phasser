function validateStage() {
    is_stage_check = true
    return is_stage_check
}

function recordAction(tokenId, gameInstanceId, actionType) {
    const key = `${tokenId}-${gameInstanceId}`;
    if (gameInstanceFlags[key]) {
        gameInstanceFlags[key].actions.push({ type: actionType, timestamp: Date.now() });
    }
}

function validateGame(tokenId, gameInstanceId) {
    const key = `${tokenId}-${gameInstanceId}`;
    console.log(key)
    if (gameInstanceFlags[key]) {
        return gameInstanceFlags[key].isActive;
    }
    return false;
}

function validateAction(tokenId, gameInstanceId) {
    const key = `${tokenId}-${gameInstanceId}`;
    if (gameInstanceFlags[key]) {
        if (gameInstanceFlags[key].isActive) {
            gameInstanceFlags[key].isActive = false
            return gameInstanceFlags[key].actions.length > 0;
        }
    }
    return false;
}

module.exports = { validateStage, recordAction, validateGame, validateAction };
