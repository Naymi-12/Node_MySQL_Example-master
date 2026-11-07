const pool = require('../services/mysql.service');


async function getAllArtists() {
    const [rows] = await pool.query(
        'SELECT * FROM artists'
    );
    return rows;
}


async function getArtistById(id) {
    const [rows] = await pool.query(
        'SELECT * FROM artists WHERE artist_id = ?',
        [id]
    );
    return rows[0];
}


async function createArtist(artist) {
    const { name } = artist;

    const [result] = await pool.query(
        'INSERT INTO artists (name) VALUES (?)',
        [name]
    );

    return result.insertId;
}


async function deleteArtist(id) {
    const [result] = await pool.query(
        'DELETE FROM artists WHERE artist_id = ?',
        [id]
    );

    return result.affectedRows;
}


async function getArtistsByEventId(eventId) {
    const [rows] = await pool.query(
        `SELECT a.artist_id, a.name, ca.presentation_time
         FROM artists a
         INNER JOIN concert_artists ca
         ON a.artist_id = ca.artist_id
         WHERE ca.event_id = ?`,
        [eventId]
    );

    return rows;
}


async function addArtistToConcert(eventId, artistId, presentationTime) {
    const [result] = await pool.query(
        `INSERT INTO concert_artists
         (event_id, artist_id, presentation_time)
         VALUES (?, ?, ?)`,
        [eventId, artistId, presentationTime]
    );

    return result.affectedRows;
}

module.exports = {
    getAllArtists,
    getArtistById,
    createArtist,
    deleteArtist,
    getArtistsByEventId,
    addArtistToConcert
};