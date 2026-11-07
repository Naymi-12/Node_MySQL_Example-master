
const reviewsService = require('../services/reviews.service');
const usersService = require('../services/users.service');
const eventsService = require('../services/events.service');
const ticketsService = require('../services/tickets.service');


async function getAllReviews(req, res) {
    try {
        const reviews = await reviewsService.getAllReviews();
        return res.status(200).json(reviews);
    } catch (error) {
        return res.status(500).json({
            message: 'Error retrieving reviews',
            error: error.message
        });
    }
}


async function getReviewById(req, res) {
    try {
        const review = await reviewsService.getReviewById(req.params.id);

        if (!review) {
            return res.status(404).json({
                message: 'Review not found'
            });
        }

        review.tags = await reviewsService.getTagsByReviewId(
            review.review_id
        );

        return res.status(200).json(review);

    } catch (error) {
        return res.status(500).json({
            message: 'Error retrieving review',
            error: error.message
        });
    }
}

async function getReviewsByEventId(req, res) {
    try {
        const eventId = req.params.eventId;

        const event = await eventsService.getEventById(eventId);

        if (!event) {
            return res.status(404).json({
                message: 'Event not found'
            });
        }

       const reviews = await reviewsService.getReviewsByEventId(eventId);


    for (const review of reviews) {
    review.tags = await reviewsService.getTagsByReviewId(review.review_id);
    }

    return res.status(200).json(reviews);
    } catch (error) {
        return res.status(500).json({
            message: 'Error retrieving event reviews',
            error: error.message
        });
    }
}



async function getReviewsByUserId(req, res) {
    try {
        const userId = req.params.id;

        const user = await usersService.getUserById(userId);

        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        const reviews = await reviewsService.getReviewsByUserId(userId);

       
        return res.status(200).json(reviews);

    } catch (error) {
        console.error('Error retrieving user reviews:', error);

        return res.status(500).json({
            message: 'Error retrieving user reviews',
            error: error.message
        });
    }
}

async function createReview(req, res) {
    try {
        const userId = req.user.user_id;
        const { event_id, rating, comment, seat_quality, tags } = req.body;

        if (event_id === undefined || rating === undefined) {
            return res.status(400).json({
                message: 'event_id and rating are required'
            });
        }

        if (
            !Number.isInteger(Number(event_id)) ||
            Number(event_id) <= 0
        ) {
            return res.status(400).json({
                message: 'Invalid event_id'
            });
        }

        if (
            !Number.isInteger(Number(rating)) ||
            Number(rating) < 1 ||
            Number(rating) > 5
        ) {
            return res.status(400).json({
                message: 'Rating must be an integer between 1 and 5'
            });
        }

        const event = await eventsService.getEventById(event_id);

        if (!event) {
            return res.status(404).json({
                message: 'Event not found'
            });
        }

        const userTickets = await ticketsService.getTicketsByUserId(userId);

        const attended = userTickets.some(ticket =>
            Number(ticket.event_id) === Number(event_id) &&
            ticket.status === 'completed'
        );

        if (!attended) {
            return res.status(403).json({
                message: 'You can only review events you have attended'
            });
        }

        const review = {
            user_id: Number(userId),
            event_id: Number(event_id),
            rating: Number(rating),
            comment: comment || null,
            seat_quality: seat_quality || null
        };

        const reviewId = await reviewsService.createReview(review);
           
         if (Array.isArray(tags)) {
          for (const tagName of tags) {
        
        let tag = await reviewsService.getTagByName(tagName);

       
        if (!tag) {
            const tagId = await reviewsService.createTag(tagName);
            tag = { tag_id: tagId };
        }

        
        await reviewsService.addTagToReview(reviewId, tag.tag_id);
    }
}

        return res.status(201).json({
            message: 'Review created successfully',
            review_id: reviewId
        });

    } catch (error) {
        return res.status(500).json({
            message: 'Error creating review',
            error: error.message
        });
    }
}


async function deleteReview(req, res) {
    try {
        const id = req.params.id;

        const review = await reviewsService.getReviewById(id);

        if (!review) {
            return res.status(404).json({
                message: 'Review not found'
            });
        }

        await reviewsService.deleteReview(id);

        return res.status(200).json({
            message: 'Review deleted successfully',
            review_id: id
        });

    } catch (error) {
        return res.status(500).json({
            message: 'Error deleting review',
            error: error.message
        });
    }
}

module.exports = {
    getAllReviews,
    getReviewById,
    getReviewsByEventId,
    getReviewsByUserId,
    createReview,
    deleteReview
};

