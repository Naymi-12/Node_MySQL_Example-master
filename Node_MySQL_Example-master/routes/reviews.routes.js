
const express = require('express');
const router = express.Router();

const reviewsController = require('../controllers/reviews.controller');
const verifyToken = require('../middlewares/auth.middleware');

const {
    requireAdmin,
    requireSelfOrAdmin
} = require('../middlewares/authorize.middleware');

/**
 * @swagger
 * /api/reviews:
 *   get:
 *     summary: Get all reviews
 *     tags: [Reviews]
 *     description: Retrieves all registered reviews. Only administrators can perform this operation.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Reviews retrieved successfully
 *         content:
 *           application/json:
 *             example:
 *               - review_id: 1
 *                 user_id: 2
 *                 event_id: 2
 *                 rating: 5
 *                 comment: Excellent event
 *                 seat_quality: Very comfortable
 *               - review_id: 2
 *                 user_id: 2
 *                 event_id: 2
 *                 rating: 4
 *                 comment: Great atmosphere
 *                 seat_quality: Good
 *       401:
 *         description: Access denied. Token required or invalid token.
 *       403:
 *         description: Administrator permissions required
 *       500:
 *         description: Error retrieving reviews
 */
router.get('/', verifyToken, requireAdmin, reviewsController.getAllReviews);

/**
 * @swagger
 * /api/reviews/event/{eventId}:
 *   get:
 *     summary: Get reviews by event ID
 *     tags: [Reviews]
 *     description: Retrieves all reviews associated with a specific event, including their tags.
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Unique event ID
 *         example: 2
 *     responses:
 *       200:
 *         description: Event reviews retrieved successfully
 *         content:
 *           application/json:
 *             example:
 *               - review_id: 1
 *                 user_id: 2
 *                 event_id: 2
 *                 rating: 5
 *                 comment: Excellent event
 *                 seat_quality: Very comfortable
 *                 tags:
 *                   - tag_id: 1
 *                     name: Good atmosphere
 *                   - tag_id: 2
 *                     name: Good sound
 *       404:
 *         description: Event not found
 *       500:
 *         description: Error retrieving event reviews
 */
router.get('/event/:eventId', reviewsController.getReviewsByEventId);

/**
 * @swagger
 * /api/reviews/user/{id}:
 *   get:
 *     summary: Get reviews by user ID
 *     tags: [Reviews]
 *     description: Retrieves all reviews created by a specific user. Users can access their own reviews, while administrators can access any user's reviews.
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
 *                 comment: Excellent event
 *                 seat_quality: Very comfortable
 *       401:
 *         description: Access denied. Token required or invalid token.
 *       403:
 *         description: You can only access your own information unless you are an administrator.
 *       404:
 *         description: User not found
 *       500:
 *         description: Error retrieving user reviews
 */
router.get('/user/:id', verifyToken, requireSelfOrAdmin, reviewsController.getReviewsByUserId);

/**
 * @swagger
 * /api/reviews/{id}:
 *   get:
 *     summary: Get review by ID
 *     tags: [Reviews]
 *     description: Retrieves a specific review, including its associated tags.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Unique review ID
 *         example: 1
 *     responses:
 *       200:
 *         description: Review retrieved successfully
 *         content:
 *           application/json:
 *             example:
 *               review_id: 1
 *               user_id: 2
 *               event_id: 2
 *               rating: 5
 *               comment: Excellent event
 *               seat_quality: Very comfortable
 *               tags:
 *                 - tag_id: 1
 *                   name: Good atmosphere
 *                 - tag_id: 2
 *                   name: Good sound
 *       404:
 *         description: Review not found
 *       500:
 *         description: Error retrieving review
 */
router.get('/:id', reviewsController.getReviewById);
/**
 * @swagger
 * /api/reviews:
 *   post:
 *     summary: Create a review
 *     tags: [Reviews]
 *     description: Allows an authenticated user to review an event they have attended. Users must have a completed ticket for the event.
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
 *               - rating
 *             properties:
 *               event_id:
 *                 type: integer
 *                 example: 2
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *                 example: 5
 *               comment:
 *                 type: string
 *                 nullable: true
 *                 example: Excellent event
 *               seat_quality:
 *                 type: string
 *                 nullable: true
 *                 example: Very comfortable
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example:
 *                   - Good atmosphere
 *                   - Good sound
 *     responses:
 *       201:
 *         description: Review created successfully
 *         content:
 *           application/json:
 *             example:
 *               message: Review created successfully
 *               review_id: 3
 *       400:
 *         description: Missing required fields, invalid event ID, or rating outside the allowed range
 *       401:
 *         description: Access denied. Token required or invalid token.
 *       403:
 *         description: You can only review events you have attended
 *       404:
 *         description: Event not found
 *       500:
 *         description: Error creating review
 */
router.post('/', verifyToken, reviewsController.createReview);

/**
 * @swagger
 * /api/reviews/{id}:
 *   delete:
 *     summary: Delete review
 *     tags: [Reviews]
 *     description: Deletes an existing review. Only administrators can perform this operation.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Unique review ID
 *         example: 1
 *     responses:
 *       200:
 *         description: Review deleted successfully
 *         content:
 *           application/json:
 *             example:
 *               message: Review deleted successfully
 *               review_id: "1"
 *       401:
 *         description: Access denied. Token required or invalid token.
 *       403:
 *         description: Administrator permissions required
 *       404:
 *         description: Review not found
 *       500:
 *         description: Error deleting review
 */
router.delete('/:id', verifyToken, requireAdmin, reviewsController.deleteReview);

module.exports = router;
