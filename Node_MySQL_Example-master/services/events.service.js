const eventsDAO = require('../dao/events.dao');

async function getAllEvents(category) {
    return await eventsDAO.getAllEvents(category);
}
async function getEventById(id) {
    return await eventsDAO.getEventById(id);
}

async function createEvent(event) {
    return await eventsDAO.createEvent(event);
}

async function updateEvent(id, event) {
    return await eventsDAO.updateEvent(id, event);
}
async function patchEvent(id, event) {
    return await eventsDAO.patchEvent(id, event);
}
async function deleteEvent(id) {
    return await eventsDAO.deleteEvent(id);
}

module.exports = {
    getAllEvents,
    getEventById,
    createEvent,
    updateEvent,
    patchEvent,
    deleteEvent

};