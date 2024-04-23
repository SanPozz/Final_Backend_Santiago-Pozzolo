import { TicketMongoDAO as DAO } from "../dao/TicketMongoDAO.js"
class TicketService{
    constructor(dao){
        this.dao = new dao()
    }

    async createTicket(ticket){
        return await this.dao.createTicket(ticket)
    }
}

export const ticketService = new TicketService(DAO)