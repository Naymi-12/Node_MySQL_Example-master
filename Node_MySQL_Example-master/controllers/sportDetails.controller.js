const sportDetailsService = require('../services/sportDetails.service');
const eventsService = require('../services/events.service');


async function getSportDetails(req, res) {
    try {
        const eventId = req.params.id;

        const event = await eventsService.getEventById(eventId);

        if (!event) {
            return res.status(404).json({
                message: 'Event not found'
            });
        }

        if (event.category !== 'sports') {
            return res.status(400).json({
                message: 'This event is not a sports event'
            });
        }

        const details = await sportDetailsService.getSportDetails(eventId);

        if (!details) {
            return res.status(404).json({
                message: 'Sports details not found'
            });
        }

        return res.status(200).json(details);

    } catch (error) {
        return res.status(500).json({
            message: 'Error retrieving sports details',
            error: error.message
        });
    }
}


async function createSportDetails(req, res) {
    try {
        const eventId = req.params.id;
        const { home_team, away_team, scoreboard } = req.body;

        if (!home_team || !away_team) {
            return res.status(400).json({
                message: 'Home team and away team are required'
            });
        }

        const event = await eventsService.getEventById(eventId);

        if (!event) {
            return res.status(404).json({
                message: 'Event not found'
            });
        }

        if (event.category !== 'sports') {
            return res.status(400).json({
                message: 'This event is not a sports event'
            });
        }

        await sportDetailsService.createSportDetails({
            event_id: Number(eventId),
            home_team,
            away_team,
            scoreboard: scoreboard || null
        });

        return res.status(201).json({
            message: 'Sports details created successfully',
            event_id: Number(eventId),
            home_team,
            away_team,
            scoreboard: scoreboard || null
        });

    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({
                message: 'Sports details already exist for this event'
            });
        }

        return res.status(500).json({
            message: 'Error creating sports details',
            error: error.message
        });
    }
}


async function updateScoreboard(req, res) {
    try {
        const eventId = req.params.id;
        const { scoreboard } = req.body;

        if (scoreboard === undefined || scoreboard === null || !String(scoreboard).trim()) {
            return res.status(400).json({
                message: 'Scoreboard is required'
            });
        }

        const event = await eventsService.getEventById(eventId);

        if (!event) {
            return res.status(404).json({
                message: 'Event not found'
            });
        }

        if (event.category !== 'sports') {
            return res.status(400).json({
                message: 'This event is not a sports event'
            });
        }

        const details = await sportDetailsService.getSportDetails(eventId);

        if (!details) {
            return res.status(404).json({
                message: 'Sports details not found'
            });
        }

        await sportDetailsService.updateScoreboard(eventId, scoreboard);

        return res.status(200).json({
            message: 'Scoreboard updated successfully',
            event_id: Number(eventId),
            scoreboard
        });

    } catch (error) {
        return res.status(500).json({
            message: 'Error updating scoreboard',
            error: error.message
        });
    }
}

module.exports = {
    getSportDetails,
    createSportDetails,
    updateScoreboard
};