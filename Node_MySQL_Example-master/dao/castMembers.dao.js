const pool = require('../services/mysql.service');


async function getAllCastMembers() {
    const [rows] = await pool.query(
        'SELECT * FROM cast_members'
    );

    return rows;
}


async function getCastMemberById(id) {
    const [rows] = await pool.query(
        'SELECT * FROM cast_members WHERE cast_member_id = ?',
        [id]
    );

    return rows[0];
}


async function createCastMember(castMember) {
    const { name } = castMember;

    const [result] = await pool.query(
        'INSERT INTO cast_members (name) VALUES (?)',
        [name]
    );

    return result.insertId;
}


async function deleteCastMember(id) {
    const [result] = await pool.query(
        'DELETE FROM cast_members WHERE cast_member_id = ?',
        [id]
    );

    return result.affectedRows;
}

module.exports = {
    getAllCastMembers,
    getCastMemberById,
    createCastMember,
    deleteCastMember
};