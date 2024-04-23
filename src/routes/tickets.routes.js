import { Router } from "express";
import { ticketService } from "../services/ticket.service.js";
import { TicketControllerMongo } from "../controllers/database/TicketControllerMongo.js";

const routerTickets = Router();

routerTickets.post('/generate-ticket', TicketControllerMongo.createTicket)

export default routerTickets