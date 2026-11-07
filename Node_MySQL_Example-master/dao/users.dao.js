const pool = require('../services/mysql.service');


async function getAllUsers() {
    const [rows] = await pool.query(
        `SELECT user_id, name, email, role
         FROM users`
    );

    return rows;
}


async function getUserById(id) {
    const [rows] = await pool.query(
        `SELECT user_id, name, email, role
         FROM users
         WHERE user_id = ?`,
        [id]
    );

    return rows[0];
}


async function getUserByEmail(email) {
    const [rows] = await pool.query(
        `SELECT user_id, name, email, password, role
         FROM users
         WHERE email = ?`,
        [email]
    );

    return rows[0];
}

async function createUser(user) {
    const {
        name,
        email,
        password,
        role = 'user'
    } = user;

    const [result] = await pool.query(
        `INSERT INTO users (name, email, password, role)
         VALUES (?, ?, ?, ?)`,
        [name, email, password, role]
    );

    return result.insertId;
}
async function updateUser(id, user) {
    const {
        name,
        email,
        password,
        role
    } = user;

    const [result] = await pool.query(
        `UPDATE users
         SET name = ?,
             email = ?,
             password = ?,
             role = ?
         WHERE user_id = ?`,
        [name, email, password, role, id]
    );

    return result;
}

async function patchUser(id, user) {
    const fields = [];
    const values = [];

    const allowedFields = [
        'name',
        'email',
        'password',
        'role'
    ];

    for (const field of allowedFields) {
        if (user[field] !== undefined) {
            fields.push(`${field} = ?`);
            values.push(user[field]);
        }
    }

    if (fields.length === 0) {
        return null;
    }

    values.push(id);

    const [result] = await pool.query(
        `UPDATE users
         SET ${fields.join(', ')}
         WHERE user_id = ?`,
        values
    );

    return result;
}

async function deleteUser(id) {
    const [result] = await pool.query(
        'DELETE FROM users WHERE user_id = ?',
        [id]
    );

    return result;
}


async function getUserTickets(id) {
    const [rows] = await pool.query(
        `SELECT *
         FROM tickets
         WHERE user_id = ?`,
        [id]
    );

    return rows;
}


async function getUserReviews(id) {
    const [rows] = await pool.query(
        `SELECT *
         FROM reviews
         WHERE user_id = ?`,
        [id]
    );

    return rows;
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