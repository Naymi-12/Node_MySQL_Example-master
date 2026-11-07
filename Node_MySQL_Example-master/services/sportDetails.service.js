const sportDetailsDAO = require('../dao/sportDetails.dao');

async function getSportDetails(eventId) {
    return await sportDetailsDAO.getSportDetails(eventId);
}

async function createSportDetails(details) {
    return await sportDetailsDAO.createSportDetails(details);
}

async function updateScoreboard(eventId, scoreboard) {
    return await sportDetailsDAO.updateScoreboard(eventId, scoreboard);
}

module.exports = {
    getSportDetails,
    createSportDetails,
    updateScoreboard
};