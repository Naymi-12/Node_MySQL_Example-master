const artistsService = require('../services/artists.service');

const eventsService = require('../services/events.service');


async function getAllArtists(req, res) {
    try {
        const artists = await artistsService.getAllArtists();
        return res.status(200).json(artists);
    } catch (error) {
        return res.status(500).json({
            message: 'Error retrieving artists',
            error: error.message
        });
    }
}

async function getArtistById(req, res) {
    try {
        const artist = await artistsService.getArtistById(req.params.id);

        if (!artist) {
            return res.status(404).json({
                message: 'Artist not found'
            });
        }

        return res.status(200).json(artist);
    } catch (error) {
        return res.status(500).json({
            message: 'Error retrieving artist',
            error: error.message
        });
    }
}


async function createArtist(req, res) {
    try {
        const { name } = req.body;

        if (!name || !name.trim()) {
            return res.status(400).json({
                message: 'Artist name is required'
            });
        }

        const artistId = await artistsService.createArtist({
            name: name.trim()
        });

        return res.status(201).json({
            message: 'Artist created successfully',
            artist_id: artistId
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Error creating artist',
            error: error.message
        });
    }
}


async function deleteArtist(req, res) {
    try {
        const id = req.params.id;

        const artist = await artistsService.getArtistById(id);

        if (!artist) {
            return res.status(404).json({
                message: 'Artist not found'
            });
        }

        await artistsService.deleteArtist(id);

        return res.status(200).json({
            message: 'Artist deleted successfully',
            artist_id: id
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Error deleting artist',
            error: error.message
        });
    }
}

// Consultar artistas asociados a un concierto
async function getArtistsByEventId(req, res) {
    try {
        const eventId = req.params.id;

        const event = await eventsService.getEventById(eventId);

        if (!event) {
            return res.status(404).json({
                message: 'Event not found'
            });
        }

        if (event.category !== 'concert') {
            return res.status(400).json({
                message: 'This event is not a concert'
            });
        }

        const artists = await artistsService.getArtistsByEventId(eventId);

        return res.status(200).json(artists);

    } catch (error) {
        return res.status(500).json({
            message: 'Error retrieving concert artists',
            error: error.message
        });
    }
}


async function addArtistToConcert(req, res) {
    try {
        const eventId = req.params.id;
        const { artist_id, presentation_time } = req.body;

        if (!artist_id) {
            return res.status(400).json({
                message: 'Artist ID is required'
            });
        }

        const event = await eventsService.getEventById(eventId);

        if (!event) {
            return res.status(404).json({
                message: 'Event not found'
            });
        }

        if (event.category !== 'concert') {
            return res.status(400).json({
                message: 'This event is not a concert'
            });
        }

        const artist = await artistsService.getArtistById(artist_id);

        if (!artist) {
            return res.status(404).json({
                message: 'Artist not found'
            });
        }

        await artistsService.addArtistToConcert(
            eventId,
            artist_id,
            presentation_time || null
        );

        return res.status(201).json({
            message: 'Artist added to concert successfully',
            event_id: Number(eventId),
            artist_id: Number(artist_id),
            presentation_time: presentation_time || null
        });

    } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({
            message: 'This artist is already assigned to this concert'
        });
    }

    return res.status(500).json({
        message: 'Error adding artist to concert',
        error: error.message
    });
}
}

module.exports = {
    getAllArtists,
    getArtistById,
    createArtist,
    deleteArtist,
    getArtistsByEventId,
    addArtistToConcert
};