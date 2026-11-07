
const pool = require('../services/mysql.service');


async function getAllTickets() {
    const [rows] = await pool.query(
        'SELECT * FROM tickets'
    );
    return rows;
}


async function getTicketById(id) {
    const [rows] = await pool.query(
        'SELECT * FROM tickets WHERE ticket_id = ?',
        [id]
    );
    return rows[0];
}


async function getTicketsByUserId(userId) {
    const [rows] = await pool.query(
        `SELECT
            tickets.*,
            CASE
                WHEN events.date_time < NOW()
                THEN 'completed'
                ELSE 'upcoming'
            END AS current_status
         FROM tickets
         INNER JOIN events
         ON tickets.event_id = events.event_id
         WHERE tickets.user_id = ?`,
        [userId]
    );

    return rows;
}

async function getDailySales() {
    const [rows] = await pool.query(
        `SELECT
            COUNT(*) AS tickets_sold,
            COALESCE(SUM(paid_price), 0) AS total_sales
         FROM tickets
         WHERE DATE(purchase_date) = CURDATE()`
    );

    return rows[0];
}

async function createTicket(ticket) {
    const { user_id, event_id, paid_price, status } = ticket;

    const [result] = await pool.query(
        `INSERT INTO tickets
        (user_id, event_id, paid_price, status)
        VALUES (?, ?, ?, ?)`,
        [user_id, event_id, paid_price, status]
    );

    return result.insertId;
}


async function deleteTicket(id) {
    const [result] = await pool.query(
        'DELETE FROM tickets WHERE ticket_id = ?',
        [id]
    );
    return result.affectedRows;
}

module.exports = {
    getAllTickets,
    getTicketById,
    getTicketsByUserId,
    createTicket,
    deleteTicket,
    getDailySales
};
