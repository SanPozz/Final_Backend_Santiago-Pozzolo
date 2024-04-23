import Ticket from "./models/ticket.models.js";

export class TicketsMongoDAO {
    async createTicket(ticket) {
        return await Ticket.create(ticket);
    }

    async getTickets() {
        return await Ticket.find();
    }

    async getTicketById(id) {
        return await Ticket.findById(id);
    }

    async deleteTicket(id) {
        return await Ticket.findByIdAndDelete(id);
    }

    async updateTicket(id, ticket) {
        return await Ticket.findByIdAndUpdate(id, ticket);
    }
}