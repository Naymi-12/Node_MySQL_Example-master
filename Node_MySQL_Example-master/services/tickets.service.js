
const ticketsDAO = require('../dao/tickets.dao');

async function getAllTickets() {
    return await ticketsDAO.getAllTickets();
}

async function getTicketById(id) {
    return await ticketsDAO.getTicketById(id);
}

async function getTicketsByUserId(userId) {
    return await ticketsDAO.getTicketsByUserId(userId);
}

async function createTicket(ticket) {
    return await ticketsDAO.createTicket(ticket);
}

async function deleteTicket(id) {
    return await ticketsDAO.deleteTicket(id);
}
async function getDailySales() {
    return await ticketsDAO.getDailySales();
}
module.exports = {
    getAllTickets,
    getTicketById,
    getTicketsByUserId,
    createTicket,
    deleteTicket,
    getDailySales
};
