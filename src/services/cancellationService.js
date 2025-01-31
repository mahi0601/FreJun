
import Ticket from "../models/Ticket.js";
import BerthAllocation from "../models/BerthAllocation.js";
import ticketRepository from "../repositories/ticketRepository.js";
import db from "../config/db.js";

const cancelTicket = async (ticketId) => {
    return await db.transaction(async (transaction) => {
        const ticket = await ticketRepository.getTicketById(ticketId, { transaction });
        if (!ticket) {
            throw new Error("Ticket not found");
        }

        await ticketRepository.deleteTicket(ticketId, { transaction });

        if (ticket.status === "CONFIRMED") {
            const racTicket = await Ticket.findOne({ where: { status: "RAC" }, order: [['created_at', 'ASC']], lock: true, transaction });
            if (racTicket) {
                await ticketRepository.updateTicketStatus(racTicket.id, "CONFIRMED", { transaction });
                const waitingTicket = await Ticket.findOne({ where: { status: "WAITING" }, order: [['created_at', 'ASC']], lock: true, transaction });
                if (waitingTicket) {
                    await ticketRepository.updateTicketStatus(waitingTicket.id, "RAC", { transaction });
                }
            }
        }

        return { message: "Ticket canceled successfully" };
    });
};

export default { cancelTicket };