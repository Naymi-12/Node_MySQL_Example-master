const eventsService = require('../services/events.service');
const castMembersService = require('../services/castMembers.service');
const pool = require('../services/mysql.service');

console.log('Events service:', eventsService);

console.log('getAllEvents:', typeof eventsService.getAllEvents);
async function getAllEvents(req, res) {
    try {
        const { category } = req.query;

        const allowedCategories = ['concert', 'sports', 'theater'];

        if (category && !allowedCategories.includes(category)) {
            return res.status(400).json({
                message: 'Invalid category',
                allowed_categories: allowedCategories
            });
        }

        const events = await eventsService.getAllEvents(category);

        return res.status(200).json(events);

    } catch (error) {
        return res.status(500).json({
            message: 'Error retrieving events',
            error: error.message
        });
    }
}

async function getEventById(req, res) {
    try {
        const id = req.params.id;

        const event = await eventsService.getEventById(id);

        if (!event) {
            return res.status(404).json({
                message: 'Event not found'
            });
        }

        res.status(200).json(event);

    } catch (error) {
        res.status(500).json({
            message: 'Error retrieving event',
            error: error.message
        });
    }
}
async function createEvent(req, res) {
    try {
        const event = req.body;

        
        const requiredFields = [
            'name',
            'location',
            'date_time',
            'category',
            'min_price',
            'max_price',
            'description'
        ];

        const missingFields = requiredFields.filter(
            field =>
                event[field] === undefined ||
                event[field] === null ||
                (typeof event[field] === 'string' && !event[field].trim())
        );

        if (missingFields.length > 0) {
            return res.status(400).json({
                message: 'Missing or empty required fields',
                fields: missingFields
            });
        }

      
        const allowedCategories = ['concert', 'sports', 'theater'];

        if (!allowedCategories.includes(event.category)) {
            return res.status(400).json({
                message: 'Invalid category',
                allowed_categories: allowedCategories
            });
        }

      
        if (
            !Number.isFinite(Number(event.min_price)) ||
            !Number.isFinite(Number(event.max_price)) ||
            Number(event.min_price) < 0 ||
            Number(event.max_price) < Number(event.min_price)
        ) {
            return res.status(400).json({
                message: 'Invalid event prices'
            });
        }

        const newEventId = await eventsService.createEvent(event);

        return res.status(201).json({
            message: 'Event created successfully',
            event_id: newEventId
        });

    } catch (error) {
        return res.status(500).json({
            message: 'Error creating event',
            error: error.message
        });
    }
}
async function updateEvent(req, res) {
    try {
        const id = req.params.id;
        const event = req.body;

        // Check that all fields are provided
        const requiredFields = [
            'name',
            'location',
            'date_time',
            'category',
            'min_price',
            'max_price',
            'description'
        ];

        const missingFields = requiredFields.filter(
            field => event[field] === undefined || event[field] === null
        );

        if (missingFields.length > 0) {
            return res.status(400).json({
                message: 'Missing required fields',
                fields: missingFields
            });
        }

        const existingEvent = await eventsService.getEventById(id);

        if (!existingEvent) {
            return res.status(404).json({
                message: 'Event not found'
            });
        }

        await eventsService.updateEvent(id, event);

        const updatedEvent = await eventsService.getEventById(id);

        res.status(200).json({
            message: 'Event updated successfully',
            event: updatedEvent
        });

    } catch (error) {
        res.status(500).json({
            message: 'Error updating event',
            error: error.message
        });
    }
}
async function patchEvent(req, res) {
    try {
        const id = req.params.id;
        const event = req.body;

        const allowedFields = [
            'name',
            'location',
            'date_time',
            'category',
            'min_price',
            'max_price',
            'description'
        ];

        const fieldsToUpdate = Object.keys(event);

        if (fieldsToUpdate.length === 0) {
            return res.status(400).json({
                message: 'You must provide at least one field to update'
            });
        }

        const invalidFields = fieldsToUpdate.filter(
            field => !allowedFields.includes(field)
        );

        if (invalidFields.length > 0) {
            return res.status(400).json({
                message: 'Invalid fields',
                fields: invalidFields
            });
        }

        const existingEvent = await eventsService.getEventById(id);

        if (!existingEvent) {
            return res.status(404).json({
                message: 'Event not found'
            });
        }

        await eventsService.patchEvent(id, event);

        const updatedEvent = await eventsService.getEventById(id);

        res.status(200).json({
            message: 'Event updated successfully',
            event: updatedEvent
        });

    } catch (error) {
        res.status(500).json({
            message: 'Error updating event',
            error: error.message
        });
    }
}
async function deleteEvent(req, res) {
    try {
        const id = req.params.id;

        const existingEvent = await eventsService.getEventById(id);

        if (!existingEvent) {
            return res.status(404).json({
                message: 'Event not found'
            });
        }

        await eventsService.deleteEvent(id);

        res.status(200).json({
            message: 'Event deleted successfully',
            event_id: id
        });

    } catch (error) {
        res.status(500).json({
            message: 'Error deleting event',
            error: error.message
        });
    }
}


async function getCastByEventId(req, res) {
    try {
        const eventId = req.params.id;

        const event = await eventsService.getEventById(eventId);

        if (!event) {
            return res.status(404).json({
                message: 'Event not found'
            });
        }

        if (event.category !== 'theater') {
            return res.status(400).json({
                message: 'This event is not a theater performance'
            });
        }

        const [cast] = await pool.query(
            `SELECT cm.cast_member_id, cm.name
             FROM cast_members cm
             INNER JOIN theater_cast tc
             ON cm.cast_member_id = tc.cast_member_id
             WHERE tc.event_id = ?`,
            [eventId]
        );

        return res.status(200).json(cast);

    } catch (error) {
        return res.status(500).json({
            message: 'Error retrieving theater cast',
            error: error.message
        });
    }
}


async function addCastMemberToTheater(req, res) {
    try {
        const eventId = req.params.id;
        const { cast_member_id } = req.body;

        if (!cast_member_id) {
            return res.status(400).json({
                message: 'Cast member ID is required'
            });
        }

        const event = await eventsService.getEventById(eventId);

        if (!event) {
            return res.status(404).json({
                message: 'Event not found'
            });
        }

        if (event.category !== 'theater') {
            return res.status(400).json({
                message: 'This event is not a theater performance'
            });
        }

        const castMember = await castMembersService.getCastMemberById(
            cast_member_id
        );

        if (!castMember) {
            return res.status(404).json({
                message: 'Cast member not found'
            });
        }

       
        await pool.query(
            `INSERT IGNORE INTO theater_details (event_id, intermissions)
             VALUES (?, 'Sin intermedios registrados')`,
            [eventId]
        );

        await pool.query(
            `INSERT INTO theater_cast (event_id, cast_member_id)
             VALUES (?, ?)`,
            [eventId, cast_member_id]
        );

        return res.status(201).json({
            message: 'Cast member added to theater successfully',
            event_id: Number(eventId),
            cast_member_id: Number(cast_member_id)
        });

    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({
                message: 'This cast member is already assigned to this theater'
            });
        }

        return res.status(500).json({
            message: 'Error adding cast member to theater',
            error: error.message
        });
    }
}

async function getIntermissions(req, res) {
    try {
        const eventId = req.params.id;

        const event = await eventsService.getEventById(eventId);

        if (!event) {
            return res.status(404).json({
                message: 'Event not found'
            });
        }

        if (event.category !== 'theater') {
            return res.status(400).json({
                message: 'This event is not a theater performance'
            });
        }

        const [rows] = await pool.query(
            `SELECT intermissions
             FROM theater_details
             WHERE event_id = ?`,
            [eventId]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                message: 'Theater details not found'
            });
        }

        return res.status(200).json(rows[0]);

    } catch (error) {
        return res.status(500).json({
            message: 'Error retrieving intermissions',
            error: error.message
        });
    }
}

async function updateIntermissions(req, res) {
    try {
        const eventId = req.params.id;
        const { intermissions } = req.body;

        if (!intermissions || !intermissions.trim()) {
            return res.status(400).json({
                message: 'Intermissions information is required'
            });
        }

        const event = await eventsService.getEventById(eventId);

        if (!event) {
            return res.status(404).json({
                message: 'Event not found'
            });
        }

        if (event.category !== 'theater') {
            return res.status(400).json({
                message: 'This event is not a theater performance'
            });
        }

        await pool.query(
            `INSERT INTO theater_details (event_id, intermissions)
             VALUES (?, ?)
             ON DUPLICATE KEY UPDATE intermissions = VALUES(intermissions)`,
            [eventId, intermissions]
        );

        return res.status(200).json({
            message: 'Intermissions updated successfully',
            event_id: Number(eventId),
            intermissions
        });

    } catch (error) {
        return res.status(500).json({
            message: 'Error updating intermissions',
            error: error.message
        });
    }
}
module.exports = {
    getAllEvents,
    getEventById,
    createEvent,
    updateEvent,
    patchEvent,
    deleteEvent,
    getCastByEventId,
    addCastMemberToTheater,
    getIntermissions,
    updateIntermissions
};