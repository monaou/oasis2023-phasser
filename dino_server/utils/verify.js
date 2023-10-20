const { createConnection } = require('../database');
function validateStage() {
    is_stage_check = true
    return is_stage_check
}

async function recordAction(stageId, gameInstanceId, actionType) {
    let connection;
    try {
        connection = await createConnection();
        const query = 'INSERT INTO action_record (stage_id, game_instance_id, action_type) VALUES (?, ?, ?)';
        await connection.query(query, [stageId, gameInstanceId, actionType]);
    } catch (error) {
        console.error('Error recording action:', error);
    } finally {
        if (connection) connection.end();
    }
}


async function validateGame(stageId, gameInstanceId) {
    let connection;
    try {
        connection = await createConnection();
        const query = 'SELECT * FROM action_record WHERE stage_id = ? AND game_instance_id = ?';
        const [rows] = await connection.query(query, [stageId, gameInstanceId]);
        console.log(rows)
        return rows.length > 0;
    } catch (error) {
        console.error('Error validating game:', error);
        return false;
    } finally {
        if (connection) connection.end();
    }
}


async function validateAction(stageId, gameInstanceId) {
    let connection;
    try {
        connection = await createConnection();
        const query = 'SELECT * FROM action_record WHERE stage_id = ? AND game_instance_id = ?';
        const [rows] = await connection.query(query, [stageId, gameInstanceId]);
        return rows.length > 0;
    } catch (error) {
        console.error('Error validating action:', error);
        return false;
    } finally {
        if (connection) connection.end();
    }
}


module.exports = { validateStage, recordAction, validateGame, validateAction };
