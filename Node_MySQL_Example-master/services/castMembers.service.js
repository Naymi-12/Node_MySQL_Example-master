const castMembersDAO = require('../dao/castMembers.dao');


async function getAllCastMembers() {
    return await castMembersDAO.getAllCastMembers();
}


async function getCastMemberById(id) {
    return await castMembersDAO.getCastMemberById(id);
}


async function createCastMember(castMember) {
    return await castMembersDAO.createCastMember(castMember);
}


async function deleteCastMember(id) {
    return await castMembersDAO.deleteCastMember(id);
}

module.exports = {
    getAllCastMembers,
    getCastMemberById,
    createCastMember,
    deleteCastMember
};