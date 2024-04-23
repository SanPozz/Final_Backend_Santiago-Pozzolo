import { ticketService } from "../../services/ticket.service.js";


export class TicketControllerMongo {

    static async createTicket(req,res) {

        const  ticket  = req.body;

        ticketService.createTicket(ticket)
        .then((data) => {
            res.status(200).send(data)
        })
        .catch((error) => {
            res.status(500).send(error)
        })
    }
}