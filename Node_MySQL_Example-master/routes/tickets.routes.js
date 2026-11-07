

const express = require('express');
const router = express.Router();

const ticketsController = require('../controllers/tickets.controller');
const verifyToken = require('../middlewares/auth.middleware');

const {
    requireAdmin,
    requireSelfOrAdmin
} = require('../middlewares/authorize.middleware');

/**
 * @swagger
 * /api/tickets:
 *   get:
 *     summary: Get all tickets
 *     tags: [Tickets]
 *     description: Retrieves all registered tickets. Only administrators can perform this operation.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Tickets retrieved successfully
 *         content:
 *           application/json:
 *             example:
 *               - ticket_id: 3
 *                 user_id: 2
 *                 event_id: 3
 *                 paid_price: "50000.00"
 *                 status: upcoming
 *               - ticket_id: 5
 *                 user_id: 2
 *                 event_id: 4
 *                 paid_price: "60000.00"
 *                 status: upcoming
 *       401:
 *         description: Access denied. Token required or invalid token.
 *       403:
 *         description: Administrator permissions required
 *       500:
 *         description: Error retrieving tickets
 */
router.get('/', verifyToken, requireAdmin, ticketsController.getAllTickets);

/**
 * @swagger
 * /api/tickets/user/{id}:
 *   get:
 *     summary: Get tickets by user ID
 *     tags: [Tickets]
 *     description: Retrieves all tickets belonging to a specific user. The user can access their own tickets, while administrators can access any user's tickets.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Unique user ID
 *         example: 2
 *     responses:
 *       200:
 *         description: User tickets retrieved successfully
 *         content:
 *           application/json:
 *             example:
 *               - ticket_id: 3
 *                 user_id: 2
 *                 event_id: 3
 *                 paid_price: "50000.00"
 *                 status: upcoming
 *       401:
 *         description: Access denied. Token required or invalid token.
 *       403:
 *         description: You can only access your own information unless you are an administrator.
 *       404:
 *         description: User not found
 *       500:
 *         description: Error retrieving user tickets
 */
router.get('/user/:id', verifyToken, requireSelfOrAdmin, ticketsController.getTicketsByUserId);
/**
 * @swagger
 * /api/tickets/admin/daily-sales:
 *   get:
 *     summary: Get daily ticket sales
 *     tags: [Tickets]
 *     description: Retrieves the number of tickets sold and the total sales amount for the current day. Only administrators can perform this operation.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Daily sales retrieved successfully
 *         content:
 *           application/json:
 *             example:
 *               message: Daily sales retrieved successfully
 *               tickets_sold: 12
 *               total_sales: 750000
 *       401:
 *         description: Access denied. Token required or invalid token.
 *       403:
 *         description: Administrator permissions required
 *       500:
 *         description: Error retrieving daily sales
 */
router.get('/admin/daily-sales', verifyToken, requireAdmin, ticketsController.getDailySales);
/**
 * @swagger
 * /api/tickets/{id}:
 *   get:
 *     summary: Get ticket by ID
 *     tags: [Tickets]
 *     description: Retrieves the details of a specific ticket. Only administrators can perform this operation.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Unique ticket ID
 *         example: 3
 *     responses:
 *       200:
 *         description: Ticket retrieved successfully
 *         content:
 *           application/json:
 *             example:
 *               ticket_id: 3
 *               user_id: 2
 *               event_id: 3
 *               paid_price: "50000.00"
 *               status: upcoming
 *       401:
 *         description: Access denied. Token required or invalid token.
 *       403:
 *         description: Administrator permissions required
 *       404:
 *         description: Ticket not found
 *       500:
 *         description: Error retrieving ticket
 */
router.get('/:id', verifyToken, requireAdmin, ticketsController.getTicketById);
/**
 * @swagger
 * /api/tickets:
 *   post:
 *     summary: Purchase a ticket
 *     tags: [Tickets]
 *     description: Allows an authenticated user to purchase a ticket for an upcoming event.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - event_id
 *               - paid_price
 *             properties:
 *               event_id:
 *                 type: integer
 *                 example: 3
 *               paid_price:
 *                 type: number
 *                 format: float
 *                 example: 50000
 *     responses:
 *       201:
 *         description: Ticket purchased successfully
 *         content:
 *           application/json:
 *             example:
 *               message: Ticket purchased successfully
 *               ticket_id: 6
 *       400:
 *         description: Invalid event ID, invalid price, past event, or price outside the event price range
 *       401:
 *         description: Access denied. Token required or invalid token.
 *       404:
 *         description: User or event not found
 *       500:
 *         description: Error purchasing ticket
 */

router.post('/', verifyToken, ticketsController.createTicket);

/**
 * @swagger
 * /api/tickets/{id}:
 *   delete:
 *     summary: Delete ticket
 *     tags: [Tickets]
 *     description: Deletes an existing ticket. Only administrators can perform this operation.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Unique ticket ID
 *         example: 3
 *     responses:
 *       200:
 *         description: Ticket deleted successfully
 *         content:
 *           application/json:
 *             example:
 *               message: Ticket deleted successfully
 *               ticket_id: "3"
 *       401:
 *         description: Access denied. Token required or invalid token.
 *       403:
 *         description: Administrator permissions required
 *       404:
 *         description: Ticket not found
 *       500:
 *         description: Error deleting ticket
 */
router.delete('/:id', verifyToken, requireAdmin, ticketsController.deleteTicket);



module.exports = router;

