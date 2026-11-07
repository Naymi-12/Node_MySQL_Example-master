const usersDAO = require('../dao/users.dao');


async function getAllUsers() {
    return await usersDAO.getAllUsers();
}


async function getUserById(id) {
    return await usersDAO.getUserById(id);
}

async function getUserByEmail(email) {
    return await usersDAO.getUserByEmail(email);
}

async function createUser(user) {
    return await usersDAO.createUser(user);
}

async function updateUser(id, user) {
    return await usersDAO.updateUser(id, user);
}
async function patchUser(id, user) {
    return await usersDAO.patchUser(id, user);
}
async function deleteUser(id) {
    return await usersDAO.deleteUser(id);
}

async function getUserTickets(id) {
    return await usersDAO.getUserTickets(id);
}

async function getUserReviews(id) {
    return await usersDAO.getUserReviews(id);
}
module.exports = {
    getAllUsers,
    getUserById,
    getUserByEmail,
    createUser,
    updateUser,
    patchUser,
    deleteUser,
    getUserTickets,
    getUserReviews
};