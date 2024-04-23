import { DAO } from "../dao/factories/daoTicketsExport.js"

class TicketsService{
    constructor(dao){
        this.dao = new dao()
    }

    async createTicket(ticket){
        return await this.dao.createTicket(ticket)
    }

    async getTickets(){
        return await this.dao.getTickets()
    }

    async getTicketById(id){
        return await this.dao.getTicketById(id)
    }

    async deleteTicket(id){
        return await this.dao.deleteTicket(id)
    }

    async updateTicket(id, ticket){
        return await this.dao.updateTicket(id, ticket)
    }
}

export const ticketService = new TicketsService(DAO)