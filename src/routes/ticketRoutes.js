import express from "express";
import ticketController from "../controllers/ticketController.js";
import bookingService from "../services/bookingService.js";
import cancellationService from "../services/cancellationService.js";
const router = express.Router();


router.get("/booked", ticketController.getBookedTickets);

router.get("/available", ticketController.getAvailableTickets);

router.post("/book", async (req, res) => {
    try {
        const ticket = await bookingService.bookTicket(req.body);
        res.status(201).json(ticket);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.post("/cancel/:ticketId", async (req, res) => {
    try {
        const response = await cancellationService.cancelTicket(req.params.ticketId);
        res.status(200).json(response);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

export default router;

