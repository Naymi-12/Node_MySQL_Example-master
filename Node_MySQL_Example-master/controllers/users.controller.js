const usersService = require('../services/users.service');
const reviewsService = require('../services/reviews.service');
const jwt = require('jsonwebtoken');
function isValidId(id) { return /^[1-9]\d*$/.test(id);}

async function getAllUsers(req, res) {
    try {
        const users = await usersService.getAllUsers();

        res.status(200).json(users);

    } catch (error) {
        res.status(500).json({
            message: 'Error retrieving users',
            error: error.message
        });
    }
}


      async function getUserById(req, res) {
    try {
        const id = req.params.id;


        if (!isValidId(id)) {
            return res.status(400).json({
                message: 'Invalid user ID'
            });
        }

        
        const user = await usersService.getUserById(id);

     
        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        return res.status(200).json(user);

    } catch (error) {
        return res.status(500).json({
            message: 'Error retrieving user',
            error: error.message
        });
    }
}
async function loginUser(req, res) {
    try {
        const { email, password } = req.body;

      
        if (
            typeof email !== 'string' ||
            email.trim() === '' ||
            typeof password !== 'string' ||
            password.trim() === ''
        ) {
            return res.status(400).json({
                message: 'Email and password are required'
            });
        }

       
        const user = await usersService.getUserByEmail(
            email.trim().toLowerCase()
        );

        if (!user || user.password !== password) {
            return res.status(401).json({
                message: 'Invalid email or password'
            });
        }

        const token = jwt.sign(
            {
                user_id: user.user_id,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: '1h'
            }
        );

        return res.status(200).json({
            message: 'Login successful',
            token: token,
            user: {
                user_id: user.user_id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        return res.status(500).json({
            message: 'Error logging in',
            error: error.message
        });
    }
}

async function createUser(req, res) {
    try {
        const user = req.body;

        const requiredFields = ['name', 'email', 'password'];

        const missingFields = requiredFields.filter(
            field =>
                typeof user[field] !== 'string' ||
                user[field].trim() === ''
        );

        if (missingFields.length > 0) {
            return res.status(400).json({
                message: 'Missing or invalid required fields',
                fields: missingFields
            });
        }

        const name = user.name.trim();
        const email = user.email.trim().toLowerCase();
        const password = user.password;

        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        

        if (!emailRegex.test(email)) {
            return res.status(400).json({
                message: 'Invalid email format'
            });
        }

       
        if (name.length > 100) {
            return res.status(400).json({
                message: 'Name cannot exceed 100 characters'
            });
        }

        
        if (email.length > 150) {
            return res.status(400).json({
                message: 'Email cannot exceed 150 characters'
            });
        }

        if (password.trim() === '' || password.length > 255) {
            return res.status(400).json({
                message: 'Invalid password'
            });
        }

        const newUser = {
            name,
            email,
            password,
            role: 'user'
        };

        const newUserId = await usersService.createUser(newUser);

        return res.status(201).json({
            message: 'User created successfully',
            user_id: newUserId
        });

    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({
                message: 'Email already exists'
            });
        }

        return res.status(500).json({
            message: 'Error creating user',
            error: error.message
        });
    }
}



async function updateUser(req, res) {
    try {
        const id = req.params.id;

        if (!isValidId(id)) {
            return res.status(400).json({
                message: 'Invalid user ID'
            });
        }

        const { name, email, password, role } = req.body;

        const requiredFields = ['name', 'email', 'password', 'role'];

        for (const field of requiredFields) {
            if (
                req.body[field] === undefined ||
                req.body[field] === null ||
                req.body[field] === ''
            ) {
                return res.status(400).json({
                    message: `The field ${field} is required`
                });
            }
        }

        if (
            typeof name !== 'string' ||
            name.trim().length === 0 ||
            name.length > 100
        ) {
            return res.status(400).json({
                message: 'Invalid name'
            });
        }

        if (
            typeof email !== 'string' ||
            email.trim().length === 0 ||
            email.length > 150 ||
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
        ) {
            return res.status(400).json({
                message: 'Invalid email'
            });
        }

        if (
            typeof password !== 'string' ||
            password.trim().length === 0 ||
            password.length > 255
        ) {
            return res.status(400).json({
                message: 'Invalid password'
            });
        }

        if (!['user', 'admin'].includes(role)) {
            return res.status(400).json({
                message: 'Invalid role'
            });
        }

        const existingUser = await usersService.getUserById(id);

        if (!existingUser) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        const userWithEmail = await usersService.getUserByEmail(
            email.trim().toLowerCase()
        );

        if (userWithEmail && userWithEmail.user_id !== Number(id)) {
            return res.status(409).json({
                message: 'Email already registered'
            });
        }

        await usersService.updateUser(id, {
            name: name.trim(),
            email: email.trim().toLowerCase(),
            password,
            role
        });

        const updatedUser = await usersService.getUserById(id);

        return res.status(200).json({
            message: 'User updated successfully',
            user: updatedUser
        });

    } catch (error) {
        return res.status(500).json({
            message: 'Error updating user',
            error: error.message
        });
    }
}



async function patchUser(req, res) {
    try {
        const id = req.params.id;

        if (!isValidId(id)) {
            return res.status(400).json({
                message: 'Invalid user ID'
            });
        }

        const { name, email, password, role } = req.body;

        const allowedFields = ['name', 'email', 'password', 'role'];
        const receivedFields = Object.keys(req.body);

        if (receivedFields.length === 0) {
            return res.status(400).json({
                message: 'At least one field is required'
            });
        }

        const invalidFields = receivedFields.filter(
            field => !allowedFields.includes(field)
        );

        if (invalidFields.length > 0) {
            return res.status(400).json({
                message: 'Invalid fields',
                fields: invalidFields
            });
        }

        if (name !== undefined) {
            if (
                typeof name !== 'string' ||
                name.trim().length === 0 ||
                name.length > 100
            ) {
                return res.status(400).json({
                    message: 'Invalid name'
                });
            }
        }

        if (email !== undefined) {
            if (
                typeof email !== 'string' ||
                email.trim().length === 0 ||
                email.length > 150 ||
                !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
            ) {
                return res.status(400).json({
                    message: 'Invalid email'
                });
            }
        }

        if (password !== undefined) {
            if (
                typeof password !== 'string' ||
                password.trim().length === 0 ||
                password.length > 255
            ) {
                return res.status(400).json({
                    message: 'Invalid password'
                });
            }
        }

        if (role !== undefined) {
            if (!['user', 'admin'].includes(role)) {
                return res.status(400).json({
                    message: 'Invalid role'
                });
            }
        }

        const existingUser = await usersService.getUserById(id);

        if (!existingUser) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        if (email !== undefined) {
            const userWithEmail = await usersService.getUserByEmail(
                email.trim().toLowerCase()
            );

            if (
                userWithEmail &&
                userWithEmail.user_id !== Number(id)
            ) {
                return res.status(409).json({
                    message: 'Email already registered'
                });
            }
        }

        const updateData = {};

        if (name !== undefined) {
            updateData.name = name.trim();
        }

        if (email !== undefined) {
            updateData.email = email.trim().toLowerCase();
        }

        if (password !== undefined) {
            updateData.password = password;
        }

        if (role !== undefined) {
            updateData.role = role;
        }

        await usersService.patchUser(id, updateData);

        const updatedUser = await usersService.getUserById(id);

        return res.status(200).json({
            message: 'User updated successfully',
            user: updatedUser
        });

    } catch (error) {
        return res.status(500).json({
            message: 'Error updating user',
            error: error.message
        });
    }
}


async function deleteUser(req, res) {
    try {
        const id = req.params.id;

        
        if (!isValidId(id)) {
            return res.status(400).json({
                message: 'Invalid user ID'
            });
        }

        const existingUser = await usersService.getUserById(id);

        if (!existingUser) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        await usersService.deleteUser(id);

        return res.status(200).json({
            message: 'User deleted successfully'
        });

    } catch (error) {
        return res.status(500).json({
            message: 'Error deleting user',
            error: error.message
        });
    }
}
async function getUserTickets(req, res) {
    try {
        const id = req.params.id;

        
        if (!isValidId(id)) {
            return res.status(400).json({
                message: 'Invalid user ID'
            });
        }

     
        const existingUser = await usersService.getUserById(id);

        if (!existingUser) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        
        const tickets = await usersService.getUserTickets(id);

        return res.status(200).json(tickets);

    } catch (error) {
        return res.status(500).json({
            message: 'Error retrieving user tickets',
            error: error.message
        });
    }
}

async function getUserReviews(req, res) {
    try {
        const id = req.params.id;

        if (!isValidId(id)) {
            return res.status(400).json({
                message: 'Invalid user ID'
            });
        }

        const existingUser = await usersService.getUserById(id);

        if (!existingUser) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        const reviews = await usersService.getUserReviews(id);

        for (const review of reviews) {
            review.tags = await reviewsService.getTagsByReviewId(
                review.review_id
            );
        }

        return res.status(200).json(reviews);

    } catch (error) {
        console.error('Error retrieving user reviews:', error);

        return res.status(500).json({
            message: 'Error retrieving user reviews',
            error: error.message
        });
    }
}
module.exports = {
    getAllUsers,
    getUserById,
    loginUser,
    createUser,
    updateUser,
    patchUser,
    deleteUser,
    getUserTickets,
    getUserReviews
};