const artistsDAO = require('../dao/artists.dao');

async function getAllArtists() {
    return await artistsDAO.getAllArtists();
}


async function getArtistById(id) {
    return await artistsDAO.getArtistById(id);
}


async function createArtist(artist) {
    return await artistsDAO.createArtist(artist);
}


async function deleteArtist(id) {
    return await artistsDAO.deleteArtist(id);
}


async function getArtistsByEventId(eventId) {
    return await artistsDAO.getArtistsByEventId(eventId);
}


async function addArtistToConcert(eventId, artistId, presentationTime) {
    return await artistsDAO.addArtistToConcert(
        eventId,
        artistId,
        presentationTime
    );
}

module.exports = {
    getAllArtists,
    getArtistById,
    createArtist,
    deleteArtist,
    getArtistsByEventId,
    addArtistToConcert
};