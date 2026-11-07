
function requireAdmin(req, res, next) {
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({
            message: 'Access denied. Administrator permissions required'
        });
    }

    next();
}


function requireSelfOrAdmin(req, res, next) {
    const requestedUserId = Number(req.params.id);
    const authenticatedUserId = Number(req.user.user_id);

    if (
        req.user.role !== 'admin' &&
        requestedUserId !== authenticatedUserId
    ) {
        return res.status(403).json({
            message: 'Access denied. You can only access your own information'
        });
    }

    next();
}

module.exports = {
    requireAdmin,
    requireSelfOrAdmin
};