
const express = require('express');

const eventsRoutes = require('./routes/events.routes');
const usersRoutes = require('./routes/users.routes');
const ticketsRoutes = require('./routes/tickets.routes');
const reviewsRoutes = require('./routes/reviews.routes');
const artistsRoutes = require('./routes/artists.routes');
const castMembersRoutes = require('./routes/castMembers.routes');

const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');

const app = express();

app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to the TicketForge API'
    });
});

app.use('/api/events', eventsRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/tickets', ticketsRoutes);
app.use('/api/reviews', reviewsRoutes);
app.use('/api/artists', artistsRoutes);
app.use('/api/cast-members', castMembersRoutes);

module.exports = app;

