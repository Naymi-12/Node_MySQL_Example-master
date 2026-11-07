const express = require('express');
const router = express.Router();

const castMembersController = require('../controllers/castMembers.controller');

const verifyToken = require('../middlewares/auth.middleware');
const { requireAdmin } = require('../middlewares/authorize.middleware');


/**
 * @swagger
 * /api/cast-members:
 *   get:
 *     summary: Retrieve all cast members
 *     description: Returns a list of all registered cast members.
 *     tags: [Cast Members]
 *     responses:
 *       200:
 *         description: Cast members retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   cast_member_id:
 *                     type: integer
 *                     example: 1
 *                   name:
 *                     type: string
 *                     example: Test Actor
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error retrieving cast members
 *                 error:
 *                   type: string
 *                   example: Database connection error
 */

router.get('/', castMembersController.getAllCastMembers);


/**
 * @swagger
 * /api/cast-members/{id}:
 *   get:
 *     summary: Retrieve a cast member by ID
 *     description: Returns the information of a specific cast member.
 *     tags: [Cast Members]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Cast member ID.
 *     responses:
 *       200:
 *         description: Cast member retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 cast_member_id:
 *                   type: integer
 *                   example: 1
 *                 name:
 *                   type: string
 *                   example: Test Actor
 *       404:
 *         description: Cast member not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Cast member not found
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error retrieving cast member
 *                 error:
 *                   type: string
 *                   example: Database connection error
 */

router.get('/:id', castMembersController.getCastMemberById);


/**
 * @swagger
 * /api/cast-members:
 *   post:
 *     summary: Create a new cast member
 *     description: Registers a new cast member. Only administrators can perform this operation.
 *     tags: [Cast Members]
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
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Example
 *     responses:
 *       201:
 *         description: Cast member created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Cast member created successfully
 *                 cast_member_id:
 *                   type: integer
 *                   example: 2
 *       400:
 *         description: Cast member name is missing or empty.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Cast member name is required
 *       401:
 *         description: Authentication token is missing or invalid.
 *       403:
 *         description: Administrator permissions are required.
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error creating cast member
 *                 error:
 *                   type: string
 *                   example: Database connection error
 */

router.post('/', verifyToken, requireAdmin, castMembersController.createCastMember);


/**
 * @swagger
 * /api/cast-members/{id}:
 *   delete:
 *     summary: Delete a cast member
 *     description: Deletes an existing cast member. Only administrators can perform this operation.
 *     tags: [Cast Members]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Cast member ID.
 *     responses:
 *       200:
 *         description: Cast member deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Cast member deleted successfully
 *                 cast_member_id:
 *                   type: integer
 *                   example: 1
 *       401:
 *         description: Authentication token is missing or invalid.
 *       403:
 *         description: Administrator permissions are required.
 *       404:
 *         description: Cast member not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Cast member not found
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error deleting cast member
 *                 error:
 *                   type: string
 *                   example: Database connection error
 */

router.delete('/:id', verifyToken, requireAdmin, castMembersController.deleteCastMember);

module.exports = router;