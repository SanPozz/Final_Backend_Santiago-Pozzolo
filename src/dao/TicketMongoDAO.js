import Ticket from "./models/ticket.models.js";

export class TicketMongoDAO {
    async createTicket(ticket) {
        return await Ticket.create(ticket);
    }
}