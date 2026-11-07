const pool = require('../services/mysql.service');

async function getAllEvents(category) {
    let query = 'SELECT * FROM events';
    const values = [];

    if (category) {
        query += ' WHERE category = ?';
        values.push(category);
    }

    const [rows] = await pool.query(query, values);

    return rows;
}

async function getEventById(id) {
    const [rows] = await pool.query(
        'SELECT * FROM events WHERE event_id = ?',
        [id]
    );
    return rows[0];
}

async function createEvent(event) {
    const {
        name,
        location,
        date_time,
        category,
        min_price,
        max_price,
        description
    } = event;

    const [result] = await pool.query(
        `INSERT INTO events
        (name, location, date_time, category, min_price, max_price, description)
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [name, location, date_time, category, min_price, max_price, description]
    );

    return result.insertId;
}

async function updateEvent(id, event) {
    const {
        name,
        location,
        date_time,
        category,
        min_price,
        max_price,
        description
    } = event;

    const [result] = await pool.query(
        `UPDATE events
        SET name = ?,
            location = ?,
            date_time = ?,
            category = ?,
            min_price = ?,
            max_price = ?,
            description = ?
        WHERE event_id = ?`,
        [
            name,
            location,
            date_time,
            category,
            min_price,
            max_price,
            description,
            id
        ]
    );

    return result;
}
async function patchEvent(id, event) {
    const fields = [];
    const values = [];

    const allowedFields = [
        'name',
        'location',
        'date_time',
        'category',
        'min_price',
        'max_price',
        'description'
    ];

    for (const field of allowedFields) {
        if (event[field] !== undefined) {
            fields.push(`${field} = ?`);
            values.push(event[field]);
        }
    }

    if (fields.length === 0) {
        return null;
    }

    values.push(id);

    const [result] = await pool.query(
        `UPDATE events SET ${fields.join(', ')} WHERE event_id = ?`,
        values
    );

    return result;
}

async function deleteEvent(id) {
    const [result] = await pool.query(
        'DELETE FROM events WHERE event_id = ?',
        [id]
    );

    return result;
}
module.exports = {
    getAllEvents,
    getEventById,
    createEvent,
    updateEvent,
    patchEvent,
    deleteEvent
};