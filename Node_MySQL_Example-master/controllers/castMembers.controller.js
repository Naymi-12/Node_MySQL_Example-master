const castMembersService = require('../services/castMembers.service');

async function getAllCastMembers(req, res) {
    try {
        const castMembers = await castMembersService.getAllCastMembers();

        return res.status(200).json(castMembers);

    } catch (error) {
        return res.status(500).json({
            message: 'Error retrieving cast members',
            error: error.message
        });
    }
}


async function getCastMemberById(req, res) {
    try {
        const castMember = await castMembersService.getCastMemberById(req.params.id);

        if (!castMember) {
            return res.status(404).json({
                message: 'Cast member not found'
            });
        }

        return res.status(200).json(castMember);

    } catch (error) {
        return res.status(500).json({
            message: 'Error retrieving cast member',
            error: error.message
        });
    }
}


async function createCastMember(req, res) {
    try {
        const { name } = req.body;

        if (!name || !name.trim()) {
            return res.status(400).json({
                message: 'Cast member name is required'
            });
        }

        const castMemberId = await castMembersService.createCastMember({
            name: name.trim()
        });

        return res.status(201).json({
            message: 'Cast member created successfully',
            cast_member_id: castMemberId
        });

    } catch (error) {
        return res.status(500).json({
            message: 'Error creating cast member',
            error: error.message
        });
    }
}


async function deleteCastMember(req, res) {
    try {
        const id = req.params.id;

        const castMember = await castMembersService.getCastMemberById(id);

        if (!castMember) {
            return res.status(404).json({
                message: 'Cast member not found'
            });
        }

        await castMembersService.deleteCastMember(id);

        return res.status(200).json({
            message: 'Cast member deleted successfully',
            cast_member_id: id
        });

    } catch (error) {
        return res.status(500).json({
            message: 'Error deleting cast member',
            error: error.message
        });
    }
}

module.exports = {
    getAllCastMembers,
    getCastMemberById,
    createCastMember,
    deleteCastMember
};