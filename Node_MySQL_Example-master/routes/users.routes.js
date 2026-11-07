const express = require('express');
const router = express.Router();

const usersController = require('../controllers/users.controller');
const verifyToken = require('../middlewares/auth.middleware');

const {
    requireAdmin,
    requireSelfOrAdmin
} = require('../middlewares/authorize.middleware');


/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management for TicketForge
 */

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     description: Registers a new user with the default user role.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 maxLength: 100
 *                 example: Test User
 *               email:
 *                 type: string
 *                 maxLength: 150
 *                 example: test@gmail.com
 *               password:
 *                 type: string
 *                 format: password
 *                 maxLength: 255
 *                 example: password123
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             example:
 *               message: User created successfully
 *               user_id: 6
 *       400:
 *         description: Missing or invalid required fields
 *         content:
 *           application/json:
 *             example:
 *               message: Missing or invalid required fields
 *               fields: [name, email]
 *       409:
 *         description: Email already exists
 *         content:
 *           application/json:
 *             example:
 *               message: Email already exists
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Log in a user
 *     tags: [Users]
 *     description: Validates user credentials and generates a JWT token valid for one hour.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: test@gmail.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: password123
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             example:
 *               message: Login successful
 *               token: JWT_TOKEN
 *               user:
 *                 user_id: 6
 *                 name: Test User
 *                 email: test@gmail.com
 *                 role: user
 *       400:
 *         description: Email and password are required
 *       401:
 *         description: Invalid email or password
 *         content:
 *           application/json:
 *             example:
 *               message: Invalid email or password
 *       500:
 *         description: Internal server error
 */

router.post('/', usersController.createUser);
router.post('/login', usersController.loginUser);


/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     description: Retrieves the list of all registered users. Requires administrator permissions.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Users retrieved successfully
 *         content:
 *           application/json:
 *             example:
 *               - user_id: 2
 *                 name: Maria Perez
 *                 email: maria@example.com
 *                 role: user
 *               - user_id: 4
 *                 name: Maria Lopez
 *                 email: maria2@example.com
 *                 role: admin
 *       401:
 *         description: Access denied. Token required or invalid token.
 *       403:
 *         description: Access denied. Administrator permissions required.
 *       500:
 *         description: Error retrieving users
 */

router.get('/', verifyToken, requireAdmin, usersController.getAllUsers);


/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get a user by ID
 *     tags: [Users]
 *     description: Retrieves a specific user. Users can access their own information, while administrators can access any user.
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
 *         description: User retrieved successfully
 *         content:
 *           application/json:
 *             example:
 *               user_id: 2
 *               name: Maria Perez
 *               email: maria@example.com
 *               role: user
 *       400:
 *         description: Invalid user ID
 *       401:
 *         description: Access denied. Token required or invalid token.
 *       403:
 *         description: Access denied. Users can only access their own information unless they are administrators.
 *       404:
 *         description: User not found
 *       500:
 *         description: Error retrieving user
 */

router.get('/:id', verifyToken, requireSelfOrAdmin, usersController.getUserById);

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Update a user
 *     tags: [Users]
 *     description: Updates all user information. Only administrators can perform this operation.
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - role
 *             properties:
 *               name:
 *                 type: string
 *                 example: Maria Perez
 *               email:
 *                 type: string
 *                 example: maria@example.com
 *               password:
 *                 type: string
 *                 example: newpassword123
 *               role:
 *                 type: string
 *                 enum: [user, admin]
 *                 example: user
 *     responses:
 *       200:
 *         description: User updated successfully
 *       400:
 *         description: Invalid user ID or request data
 *       401:
 *         description: Access denied. Token required or invalid token.
 *       403:
 *         description: Administrator permissions required
 *       404:
 *         description: User not found
 *       409:
 *         description: Email already exists
 *       500:
 *         description: Error updating user
 */
router.put('/:id', verifyToken, requireAdmin, usersController.updateUser);

/**
 * @swagger
 * /api/users/{id}:
 *   patch:
 *     summary: Partially update a user
 *     tags: [Users]
 *     description: Updates one or more user fields. Only administrators can perform this operation.
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
 *                 example: Maria Perez Updated
 *               email:
 *                 type: string
 *                 example: maria.updated@example.com
 *               password:
 *                 type: string
 *                 example: newpassword123
 *               role:
 *                 type: string
 *                 enum: [user, admin]
 *                 example: user
 *     responses:
 *       200:
 *         description: User updated successfully
 *       400:
 *         description: Invalid user ID, no valid fields provided, or invalid field values
 *       401:
 *         description: Access denied. Token required or invalid token.
 *       403:
 *         description: Administrator permissions required
 *       404:
 *         description: User not found
 *       409:
 *         description: Email already exists
 *       500:
 *         description: Error updating user
 */
router.patch('/:id', verifyToken, requireAdmin, usersController.patchUser);

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Delete a user
 *     tags: [Users]
 *     description: Deletes a user by ID. Only administrators can perform this operation.
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
 *         description: User deleted successfully
 *         content:
 *           application/json:
 *             example:
 *               message: User deleted successfully
 *       400:
 *         description: Invalid user ID
 *       401:
 *         description: Access denied. Token required or invalid token.
 *       403:
 *         description: Administrator permissions required
 *       404:
 *         description: User not found
 *       500:
 *         description: Error deleting user
 */
router.delete('/:id', verifyToken, requireAdmin, usersController.deleteUser);

/**
 * @swagger
 * /api/users/{id}/tickets:
 *   get:
 *     summary: Get tickets purchased by a user
 *     tags: [Users]
 *     description: Retrieves all tickets purchased by a specific user. Users can access their own tickets, while administrators can access any user's tickets.
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
 *                 purchase_date: "2026-11-01T15:30:00.000Z"
 *       400:
 *         description: Invalid user ID
 *       401:
 *         description: Access denied. Token required or invalid token.
 *       403:
 *         description: Users can only access their own information unless they are administrators.
 *       404:
 *         description: User not found
 *       500:
 *         description: Error retrieving user tickets
 */
router.get('/:id/tickets', verifyToken, requireSelfOrAdmin, usersController.getUserTickets);
/**
 * @swagger
 * /api/users/{id}/reviews:
 *   get:
 *     summary: Get reviews written by a user
 *     tags: [Users]
 *     description: Retrieves all reviews written by a specific user. Users can access their own reviews, while administrators can access any user's reviews.
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
 *         description: User reviews retrieved successfully
 *         content:
 *           application/json:
 *             example:
 *               - review_id: 1
 *                 user_id: 2
 *                 event_id: 2
 *                 rating: 5
 *                 comment: Excellent event!
 *       400:
 *         description: Invalid user ID
 *       401:
 *         description: Access denied. Token required or invalid token.
 *       403:
 *         description: Users can only access their own information unless they are administrators.
 *       404:
 *         description: User not found
 *       500:
 *         description: Error retrieving user reviews
 */
router.get('/:id/reviews', verifyToken, requireSelfOrAdmin, usersController.getUserReviews);

module.exports = router;