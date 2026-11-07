const express = require('express');
const router = express.Router();

const eventsController = require('../controllers/events.controller');

const artistsController = require('../controllers/artists.controller');

const verifyToken = require('../middlewares/auth.middleware');
const { requireAdmin } = require('../middlewares/authorize.middleware');
const sportDetailsController = require('../controllers/sportDetails.controller');
/**
 * @swagger
 * /api/events:
 *   get:
 *     summary: Get all events
 *     tags: [Events]
 *     description: Retrieves a list of all events.
 *     responses:
 *       200:
 *         description: Events retrieved successfully
 *         content:
 *           application/json:
 *             example:
 *               - event_id: 2
 *                 name: Rock Concert
 *                 location: Bogota
 *                 date_time: "2026-12-20T20:00:00.000Z"
 *                 category: concert
 *                 min_price: "30000.00"
 *                 max_price: "80000.00"
 *                 description: Live rock music event
 *       500:
 *         description: Error retrieving events
 */
router.get('/', eventsController.getAllEvents);
/**
 * @swagger
 * /api/events/{id}:
 *   get:
 *     summary: Get an event by ID
 *     tags: [Events]
 *     description: Retrieves the details of a specific event.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Unique event ID
 *         example: 2
 *     responses:
 *       200:
 *         description: Event retrieved successfully
 *       400:
 *         description: Invalid event ID
 *       404:
 *         description: Event not found
 *       500:
 *         description: Error retrieving event
 */
router.get('/:id', eventsController.getEventById);
/**
 * @swagger
 * /api/events:
 *   post:
 *     summary: Create a new event
 *     tags: [Events]
 *     description: Creates a new event. Only administrators can perform this operation.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - location
 *               - date_time
 *               - category
 *               - min_price
 *               - max_price
 *             properties:
 *               name:
 *                 type: string
 *                 example: Rock Concert
 *               location:
 *                 type: string
 *                 example: Bogota
 *               date_time:
 *                 type: string
 *                 format: date-time
 *                 example: "2026-12-20T20:00:00.000Z"
 *               category:
 *                 type: string
 *                 enum: [concert, sports, theater]
 *                 example: concert
 *               min_price:
 *                 type: number
 *                 example: 30000
 *               max_price:
 *                 type: number
 *                 example: 80000
 *               description:
 *                 type: string
 *                 example: Live rock music event
 *     responses:
 *       201:
 *         description: Event created successfully
 *       400:
 *         description: Invalid or missing event data
 *       401:
 *         description: Access denied. Token required or invalid token.
 *       403:
 *         description: Administrator permissions required
 *       500:
 *         description: Error creating event
 */
router.post('/', verifyToken, requireAdmin, eventsController.createEvent);
/**
 * @swagger
 * /api/events/{id}:
 *   put:
 *     summary: Update an event
 *     tags: [Events]
 *     description: Replaces the information of an existing event. Only administrators can perform this operation.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Unique event ID
 *         example: 2
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - location
 *               - date_time
 *               - category
 *               - min_price
 *               - max_price
 *             properties:
 *               name:
 *                 type: string
 *                 example: Updated Rock Concert
 *               location:
 *                 type: string
 *                 example: Bogota
 *               date_time:
 *                 type: string
 *                 format: date-time
 *                 example: "2026-12-20T20:00:00.000Z"
 *               category:
 *                 type: string
 *                 enum: [concert, sports, theater]
 *                 example: concert
 *               min_price:
 *                 type: number
 *                 example: 35000
 *               max_price:
 *                 type: number
 *                 example: 90000
 *               description:
 *                 type: string
 *                 example: Updated live rock music event
 *     responses:
 *       200:
 *         description: Event updated successfully
 *       400:
 *         description: Invalid event ID or request data
 *       401:
 *         description: Access denied. Token required or invalid token.
 *       403:
 *         description: Administrator permissions required
 *       404:
 *         description: Event not found
 *       500:
 *         description: Error updating event
 */
router.put('/:id', verifyToken, requireAdmin, eventsController.updateEvent);
/**
 * @swagger
 * /api/events/{id}:
 *   patch:
 *     summary: Partially update an event
 *     tags: [Events]
 *     description: Updates one or more fields of an existing event. Only administrators can perform this operation.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Unique event ID
 *         example: 2
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             minProperties: 1
 *             properties:
 *               name:
 *                 type: string
 *                 example: Updated Rock Concert
 *               location:
 *                 type: string
 *                 example: Bogota
 *               date_time:
 *                 type: string
 *                 format: date-time
 *                 example: "2026-12-22T20:00:00.000Z"
 *               category:
 *                 type: string
 *                 enum: [concert, sports, theater]
 *                 example: concert
 *               min_price:
 *                 type: number
 *                 example: 35000
 *               max_price:
 *                 type: number
 *                 example: 90000
 *               description:
 *                 type: string
 *                 example: Updated event description
 *     responses:
 *       200:
 *         description: Event updated successfully
 *       400:
 *         description: Invalid event ID or request data
 *       401:
 *         description: Access denied. Token required or invalid token.
 *       403:
 *         description: Administrator permissions required
 *       404:
 *         description: Event not found
 *       500:
 *         description: Error updating event
 */
router.patch('/:id', verifyToken, requireAdmin, eventsController.patchEvent);
/**
 * @swagger
 * /api/events/{id}:
 *   delete:
 *     summary: Delete an event
 *     tags: [Events]
 *     description: Deletes an existing event by ID. Only administrators can perform this operation.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Unique event ID
 *         example: 2
 *     responses:
 *       200:
 *         description: Event deleted successfully
 *       400:
 *         description: Invalid event ID
 *       401:
 *         description: Access denied. Token required or invalid token.
 *       403:
 *         description: Administrator permissions required
 *       404:
 *         description: Event not found
 *       500:
 *         description: Error deleting event
 */
router.delete('/:id', verifyToken, requireAdmin, eventsController.deleteEvent);

/**
 * @swagger
 * /api/events/{id}/artists:
 *   get:
 *     summary: Get artists associated with a concert
 *     tags: [Events]
 *     description: Retrieves all artists associated with a specific concert.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Unique event ID
 *         example: 2
 *     responses:
 *       200:
 *         description: Artists retrieved successfully
 *       400:
 *         description: Invalid event ID
 *       404:
 *         description: Event not found
 *       500:
 *         description: Error retrieving event artists
 */
router.get('/:id/artists', artistsController.getArtistsByEventId);
/**
 * @swagger
 * /api/events/{id}/artists:
 *   post:
 *     summary: Add an artist to a concert
 *     tags: [Events]
 *     description: Associates an existing artist with a specific concert. Only administrators can perform this operation.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Unique event ID
 *         example: 2
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - artist_id
 *             properties:
 *               artist_id:
 *                 type: integer
 *                 example: 1
 *               presentation_time:
 *                 type: string
 *                 example: "20:00:00"
 *     responses:
 *       201:
 *         description: Artist added to concert successfully
 *       400:
 *         description: Invalid event ID, artist ID, or request data
 *       401:
 *         description: Access denied. Token required or invalid token.
 *       403:
 *         description: Administrator permissions required
 *       404:
 *         description: Event or artist not found
 *       409:
 *         description: Artist is already assigned to this concert
 *       500:
 *         description: Error adding artist to concert
 */
router.post('/:id/artists', verifyToken, requireAdmin, artistsController.addArtistToConcert)
/**
 * @swagger
 * /api/events/{id}/cast:
 *   get:
 *     summary: Get cast members associated with a theater event
 *     tags: [Events]
 *     description: Retrieves all cast members associated with a specific theater event.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Unique event ID
 *         example: 3
 *     responses:
 *       200:
 *         description: Cast members retrieved successfully
 *       400:
 *         description: Invalid event ID
 *       404:
 *         description: Event not found
 *       500:
 *         description: Error retrieving event cast
 */
router.get('/:id/cast', eventsController.getCastByEventId);
/**
 * @swagger
 * /api/events/{id}/cast:
 *   post:
 *     summary: Add a cast member to a theater event
 *     tags: [Events]
 *     description: Associates an existing cast member with a specific theater event. Only administrators can perform this operation.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Unique event ID
 *         example: 3
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - cast_member_id
 *             properties:
 *               cast_member_id:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Cast member added successfully
 *       400:
 *         description: Invalid event ID or cast member ID
 *       401:
 *         description: Access denied. Token required or invalid token.
 *       403:
 *         description: Administrator permissions required
 *       404:
 *         description: Event or cast member not found
 *       409:
 *         description: Cast member is already assigned to this theater event
 *       500:
 *         description: Error adding cast member
 */
router.post('/:id/cast', verifyToken, requireAdmin, eventsController.addCastMemberToTheater);
/**
 * @swagger
 * /api/events/{id}/intermissions:
 *   get:
 *     summary: Get theater event intermissions
 *     tags: [Events]
 *     description: Retrieves the intermission information of a specific theater event.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Unique event ID
 *         example: 3
 *     responses:
 *       200:
 *         description: Intermissions retrieved successfully
 *       400:
 *         description: Invalid event ID
 *       404:
 *         description: Event or theater details not found
 *       500:
 *         description: Error retrieving intermissions
 */
router.get('/:id/intermissions', eventsController.getIntermissions);
/**
 * @swagger
 * /api/events/{id}/intermissions:
 *   put:
 *     summary: Update theater event intermissions
 *     tags: [Events]
 *     description: Updates the intermission information of a theater event. Only administrators can perform this operation.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Unique event ID
 *         example: 3
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - intermissions
 *             properties:
 *               intermissions:
 *                 type: string
 *                 example: "First intermission: 20 minutes. Second intermission: 15 minutes."
 *     responses:
 *       200:
 *         description: Intermissions updated successfully
 *       400:
 *         description: Invalid event ID or intermission data
 *       401:
 *         description: Access denied. Token required or invalid token.
 *       403:
 *         description: Administrator permissions required
 *       404:
 *         description: Event or theater details not found
 *       500:
 *         description: Error updating intermissions
 */
router.put('/:id/intermissions', verifyToken, requireAdmin, eventsController.updateIntermissions);;

/**
 * @swagger
 * /api/events/{id}/sport-details:
 *   get:
 *     summary: Get sports event details
 *     tags: [Events]
 *     description: Retrieves the details of a specific sports event, including the competing teams and scoreboard.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Unique event ID
 *         example: 4
 *     responses:
 *       200:
 *         description: Sports event details retrieved successfully
 *       400:
 *         description: Invalid event ID
 *       404:
 *         description: Sports event details not found
 *       500:
 *         description: Error retrieving sports event details
 */
router.get('/:id/sport-details', sportDetailsController.getSportDetails);
/**
 * @swagger
 * /api/events/{id}/sport-details:
 *   post:
 *     summary: Create sports event details
 *     tags: [Events]
 *     description: Creates the details of a sports event, including the competing teams and scoreboard. Only administrators can perform this operation.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Unique event ID
 *         example: 4
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - home_team
 *               - away_team
 *             properties:
 *               home_team:
 *                 type: string
 *                 example: Millonarios
 *               away_team:
 *                 type: string
 *                 example: Atletico Nacional
 *               scoreboard:
 *                 type: string
 *                 nullable: true
 *                 example: "0-0"
 *     responses:
 *       201:
 *         description: Sports details created successfully
 *       400:
 *         description: Home team and away team are required, or the event is not a sports event
 *       401:
 *         description: Access denied. Token required or invalid token.
 *       403:
 *         description: Administrator permissions required
 *       404:
 *         description: Event not found
 *       409:
 *         description: Sports details already exist for this event
 *       500:
 *         description: Error creating sports details
 */
router.post('/:id/sport-details',verifyToken, requireAdmin,sportDetailsController.createSportDetails
);
/**
 * @swagger
 * /api/events/{id}/sport-details:
 *   patch:
 *     summary: Update sports event scoreboard
 *     tags: [Events]
 *     description: Updates the scoreboard of an existing sports event. Only administrators can perform this operation.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Unique event ID
 *         example: 4
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - scoreboard
 *             properties:
 *               scoreboard:
 *                 type: string
 *                 example: "2-1"
 *     responses:
 *       200:
 *         description: Scoreboard updated successfully
 *       400:
 *         description: Scoreboard is required, or the event is not a sports event
 *       401:
 *         description: Access denied. Token required or invalid token.
 *       403:
 *         description: Administrator permissions required
 *       404:
 *         description: Event or sports details not found
 *       500:
 *         description: Error updating scoreboard
 */
router.patch( '/:id/sport-details',verifyToken,requireAdmin, sportDetailsController.updateScoreboard
);
module.exports = router;