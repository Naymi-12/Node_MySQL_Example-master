

const reviewsDAO = require('../dao/reviews.dao');

async function getAllReviews() {
    return await reviewsDAO.getAllReviews();
}

async function getReviewById(id) {
    return await reviewsDAO.getReviewById(id);
}

async function getReviewsByEventId(eventId) {
    return await reviewsDAO.getReviewsByEventId(eventId);
}

async function getReviewsByUserId(userId) {
    return await reviewsDAO.getReviewsByUserId(userId);
}

async function createReview(review) {
    return await reviewsDAO.createReview(review);
}

async function deleteReview(id) {
    return await reviewsDAO.deleteReview(id);
}


async function addTagToReview(reviewId, tagId) {
    return await reviewsDAO.addTagToReview(reviewId, tagId);
}

async function getTagByName(name) {
    return await reviewsDAO.getTagByName(name);
}


async function createTag(name) {
    return await reviewsDAO.createTag(name);
}

async function getTagsByReviewId(reviewId) {
    return await reviewsDAO.getTagsByReviewId(reviewId);
}
module.exports = {
    getAllReviews,
    getReviewById,
    getReviewsByEventId,
    getReviewsByUserId,
    createReview,
    deleteReview,
    addTagToReview,
    getTagByName,
    createTag,
    getTagsByReviewId
};

