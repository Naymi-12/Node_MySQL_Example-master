
const ticketsService = require('../services/tickets.service');
const usersService = require('../services/users.service');
const eventsService = require('../services/events.service');


async function getAllTickets(req, res) {
    try {
        const tickets = await ticketsService.getAllTickets();
        return res.status(200).json(tickets);
    } catch (error) {
        return res.status(500).json({
            message: 'Error retrieving tickets',
            error: error.message
        });
    }
}


async function getTicketById(req, res) {
    try {
        const ticket = await ticketsService.getTicketById(req.params.id);

        if (!ticket) {
            return res.status(404).json({
                message: 'Ticket not found'
            });
        }

        return res.status(200).json(ticket);
    } catch (error) {
        return res.status(500).json({
            message: 'Error retrieving ticket',
            error: error.message
        });
    }
}

async function getTicketsByUserId(req, res) {
    try {
        const userId = req.params.id;

        const user = await usersService.getUserById(userId);

        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        const tickets = await ticketsService.getTicketsByUserId(userId);

        return res.status(200).json(tickets);
    } catch (error) {
        return res.status(500).json({
            message: 'Error retrieving user tickets',
            error: error.message
        });
    }
}


async function createTicket(req, res) {
    try {
      
        const userId = req.user.user_id;
        const { event_id, paid_price } = req.body;

        if (event_id === undefined || paid_price === undefined) {
            return res.status(400).json({
                message: 'event_id and paid_price are required'
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
            paid_price === '' ||
            !Number.isFinite(Number(paid_price)) ||
            Number(paid_price) <= 0
        ) {
            return res.status(400).json({
                message: 'Invalid paid_price'
            });
        }

        const user = await usersService.getUserById(userId);

        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        const event = await eventsService.getEventById(event_id);

        if (!event) {
            return res.status(404).json({
                message: 'Event not found'
            });
        }
        if (new Date(event.date_time) <= new Date()) {
            return res.status(400).json({
            message: 'Cannot purchase tickets for past events'
            });
}
        const price = Number(paid_price);

        if (
            price < Number(event.min_price) ||
            price > Number(event.max_price)
        ) {
            return res.status(400).json({
                message: 'Paid price must be within the event price range',
                min_price: Number(event.min_price),
                max_price: Number(event.max_price)
            });
        }

        const ticket = {
            user_id: Number(userId),
            event_id: Number(event_id),
            paid_price: price,
            status: new Date(event.date_time) > new Date()
                ? 'upcoming'
                : 'completed'
        };

        const ticketId = await ticketsService.createTicket(ticket);

        return res.status(201).json({
            message: 'Ticket purchased successfully',
            ticket_id: ticketId
        });

    } catch (error) {
        return res.status(500).json({
            message: 'Error purchasing ticket',
            error: error.message
        });
    }
}



async function deleteTicket(req, res) {
    try {
        const id = req.params.id;

        const ticket = await ticketsService.getTicketById(id);

        if (!ticket) {
            return res.status(404).json({
                message: 'Ticket not found'
            });
        }

        await ticketsService.deleteTicket(id);

        return res.status(200).json({
            message: 'Ticket deleted successfully',
            ticket_id: id
        });

    } catch (error) {
        return res.status(500).json({
            message: 'Error deleting ticket',
            error: error.message
        });
    }
}

async function getDailySales(req, res) {
    try {
        const sales = await ticketsService.getDailySales();

        return res.status(200).json({
            message: 'Daily sales retrieved successfully',
            tickets_sold: sales.tickets_sold,
            total_sales: sales.total_sales
        });

    } catch (error) {
        return res.status(500).json({
            message: 'Error retrieving daily sales',
            error: error.message
        });
    }
}

module.exports = {
    getAllTickets,
    getTicketById,
    getTicketsByUserId,
    createTicket,
    deleteTicket,
    getDailySales
};
