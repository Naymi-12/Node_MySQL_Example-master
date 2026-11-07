
const pool = require('../services/mysql.service');


async function getAllReviews() {
    const [rows] = await pool.query(
        'SELECT * FROM reviews'
    );
    return rows;
}


async function getReviewById(id) {
    const [rows] = await pool.query(
        'SELECT * FROM reviews WHERE review_id = ?',
        [id]
    );
    return rows[0];
}


async function getReviewsByEventId(eventId) {
    const [rows] = await pool.query(
        'SELECT * FROM reviews WHERE event_id = ?',
        [eventId]
    );
    return rows;
}


async function getReviewsByUserId(userId) {
    const [rows] = await pool.query(
        'SELECT * FROM reviews WHERE user_id = ?',
        [userId]
    );
    return rows;
}


async function createReview(review) {
    const { user_id, event_id, rating, comment, seat_quality } = review;

    const [result] = await pool.query(
        `INSERT INTO reviews
        (user_id, event_id, rating, comment, seat_quality)
        VALUES (?, ?, ?, ?, ?)`,
        [user_id, event_id, rating, comment, seat_quality]
    );

    return result.insertId;
}


async function deleteReview(id) {
    const [result] = await pool.query(
        'DELETE FROM reviews WHERE review_id = ?',
        [id]
    );

    return result.affectedRows;
}

async function addTagToReview(reviewId, tagId) {
    await pool.query(
        `INSERT INTO review_tags (review_id, tag_id)
         VALUES (?, ?)`,
        [reviewId, tagId]
    );
}


async function getTagByName(name) {
    const [rows] = await pool.query(
        'SELECT * FROM tags WHERE name = ?',
        [name]
    );

    return rows[0];
}


async function createTag(name) {
    const [result] = await pool.query(
        'INSERT INTO tags (name) VALUES (?)',
        [name]
    );

    return result.insertId;
}


async function getTagsByReviewId(reviewId) {
    const [rows] = await pool.query(
        `SELECT t.tag_id, t.name
         FROM tags t
         INNER JOIN review_tags rt ON t.tag_id = rt.tag_id
         WHERE rt.review_id = ?`,
        [reviewId]
    );

    return rows;
}
module.exports = {
    getAllReviews,
    getReviewById,
    getReviewsByEventId,
    getReviewsByUserId,
    createReview,
    deleteReview,
    addTagToReview,
    getTagByName,
    createTag,
    getTagsByReviewId
};

