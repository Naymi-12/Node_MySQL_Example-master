const express = require('express');
const router = express.Router();

const artistsController = require('../controllers/artists.controller');

const verifyToken = require('../middlewares/auth.middleware');
const { requireAdmin } = require('../middlewares/authorize.middleware');


/**
 * @swagger
 * /api/artists:
 *   get:
 *     summary: Retrieve all artists
 *     description: Returns a list of all registered artists.
 *     tags: [Artists]
 *     responses:
 *       200:
 *         description: Artists retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   artist_id:
 *                     type: integer
 *                     example: 1
 *                   name:
 *                     type: string
 *                     example: Test Artist
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error retrieving artists
 *                 error:
 *                   type: string
 *                   example: Database connection error
 */

router.get('/', artistsController.getAllArtists);


/**
 * @swagger
 * /api/artists/{id}:
 *   get:
 *     summary: Retrieve an artist by ID
 *     description: Returns the information of a specific artist.
 *     tags: [Artists]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Artist ID.
 *     responses:
 *       200:
 *         description: Artist retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 artist_id:
 *                   type: integer
 *                   example: 1
 *                 name:
 *                   type: string
 *                   example: Test Artist
 *       404:
 *         description: Artist not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Artist not found
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error retrieving artist
 *                 error:
 *                   type: string
 *                   example: Database connection error
 */

router.get('/:id', artistsController.getArtistById);

/**
 * @swagger
 * /api/artists:
 *   post:
 *     summary: Create a new artist
 *     description: Registers a new artist. Only administrators can perform this operation.
 *     tags: [Artists]
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
 *                 example: Taylor Example
 *     responses:
 *       201:
 *         description: Artist created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Artist created successfully
 *                 artist_id:
 *                   type: integer
 *                   example: 2
 *       400:
 *         description: Artist name is missing or empty.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Artist name is required
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
 *                   example: Error creating artist
 *                 error:
 *                   type: string
 *                   example: Database connection error
 */

router.post('/', verifyToken, requireAdmin, artistsController.createArtist);


/**
 * @swagger
 * /api/artists/{id}:
 *   delete:
 *     summary: Delete an artist
 *     description: Deletes an existing artist. Only administrators can perform this operation.
 *     tags: [Artists]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Artist ID.
 *     responses:
 *       200:
 *         description: Artist deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Artist deleted successfully
 *                 artist_id:
 *                   type: integer
 *                   example: 1
 *       401:
 *         description: Authentication token is missing or invalid.
 *       403:
 *         description: Administrator permissions are required.
 *       404:
 *         description: Artist not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Artist not found
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error deleting artist
 *                 error:
 *                   type: string
 *                   example: Database connection error
 */

router.delete('/:id', verifyToken, requireAdmin, artistsController.deleteArtist);

module.exports = router;