const pool = require('../services/mysql.service');


async function getSportDetails(eventId) {
    const [rows] = await pool.query(
        'SELECT * FROM sport_details WHERE event_id = ?',
        [eventId]
    );

    return rows[0];
}


async function createSportDetails(details) {
    const { event_id, home_team, away_team, scoreboard } = details;

    const [result] = await pool.query(
        `INSERT INTO sport_details
         (event_id, home_team, away_team, scoreboard)
         VALUES (?, ?, ?, ?)`,
        [event_id, home_team, away_team, scoreboard || null]
    );

    return result.affectedRows;
}


async function updateScoreboard(eventId, scoreboard) {
    const [result] = await pool.query(
        `UPDATE sport_details
         SET scoreboard = ?
         WHERE event_id = ?`,
        [scoreboard, eventId]
    );

    return result.affectedRows;
}

module.exports = {
    getSportDetails,
    createSportDetails,
    updateScoreboard
};