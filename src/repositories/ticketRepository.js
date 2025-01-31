import Ticket from "../models/Ticket.js";
import sequelize from "../config/db.js";

const createTicket = async (ticketData) => {
    return await Ticket.create(ticketData);
};

const getTicketById = async (id) => {
    return await Ticket.findByPk(id);
};

const getAllTickets = async () => {
    return await Ticket.findAll();
};

const updateTicketStatus = async (id, status) => {
    return await Ticket.update({ status }, { where: { id } });
};

const deleteTicket = async (id) => {
    return await Ticket.destroy({ where: { id } });
};

export default { createTicket, getTicketById, getAllTickets, updateTicketStatus, deleteTicket };

