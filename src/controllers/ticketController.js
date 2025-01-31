

import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';

const dbPromise = open({
    filename: path.join(process.cwd(), 'src/database/railway.db'),
    driver: sqlite3.Database
});

const TOTAL_CONFIRMED_BERTHS = 63;
const TOTAL_RAC_BERTHS = 9;
const TOTAL_WAITING_LIST = 10;

export const bookTicket = async (req, res) => {
    try {
        const db = await dbPromise;
        const { name, age, gender, hasChild } = req.body;

        if (!name || !age || !gender) {
            return res.status(400).json({ message: 'Missing required passenger details' });
        }


        const result = await db.run(
            "INSERT INTO passengers (name, age, gender, hasChild) VALUES (?, ?, ?, ?)",
            [name, age, gender, hasChild ? 1 : 0]
        );
        
        const passengerId = result.lastID;

        const confirmedCount = (await db.get("SELECT COUNT(*) as count FROM tickets WHERE status = 'CONFIRMED'"))?.count || 0;
        const racCount = (await db.get("SELECT COUNT(*) as count FROM tickets WHERE status = 'RAC'"))?.count || 0;
        const waitingCount = (await db.get("SELECT COUNT(*) as count FROM tickets WHERE status = 'WAITING'"))?.count || 0;

        let status = 'WAITING';
        if (confirmedCount < TOTAL_CONFIRMED_BERTHS) {
            status = 'CONFIRMED';
        } else if (racCount < TOTAL_RAC_BERTHS) {
            status = 'RAC';
        }

        // Insert ticket into tickets table
        await db.run(
            "INSERT INTO tickets (passenger_id, status, berth_type) VALUES (?, ?, ?)",
            [passengerId, status, 'LOWER']
        );

        res.status(201).json({ message: "Ticket booked successfully", passengerId, status });
    } catch (error) {
        console.error("Error booking ticket:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};
export const cancelTicket = async (req, res) => {
    try {
        const db = await dbPromise;
        await db.exec("BEGIN TRANSACTION");

        const { ticketId } = req.params;
        const ticket = await db.get("SELECT * FROM tickets WHERE id = ?", [ticketId]);
        if (!ticket) {
            await db.exec("ROLLBACK"); 
            return res.status(404).json({ message: "Ticket not found" });
        }

        await db.run("DELETE FROM tickets WHERE id = ?", [ticketId]);

        const racTicket = await db.get("SELECT * FROM tickets WHERE status = 'RAC' ORDER BY id ASC LIMIT 1");
        if (racTicket) {
            await db.run("UPDATE tickets SET status = 'CONFIRMED' WHERE id = ?", [racTicket.id]);
        }

        const waitingTicket = await db.get("SELECT * FROM tickets WHERE status = 'WAITING' ORDER BY id ASC LIMIT 1");
        if (waitingTicket) {
            await db.run("UPDATE tickets SET status = 'RAC' WHERE id = ?", [waitingTicket.id]);
        }

        await db.exec("COMMIT"); 
        res.json({ message: "Ticket cancelled successfully" });

    } catch (error) {
        await db.exec("ROLLBACK"); 
        console.error("Error cancelling ticket:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


export const getBookedTickets = async (_req, res) => {
    try {
        const db = await dbPromise;
        const tickets = await db.all("SELECT * FROM tickets WHERE status != 'WAITING'");
        res.json({ tickets });
    } catch (error) {
        console.error("Error fetching booked tickets:", error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const getAvailableTickets = async (req, res) => {
    try {
        const db = await dbPromise;

        const confirmedCount = (await db.get("SELECT COUNT(*) as count FROM tickets WHERE status = 'CONFIRMED'"))?.count || 0;
        const racCount = (await db.get("SELECT COUNT(*) as count FROM tickets WHERE status = 'RAC'"))?.count || 0;
        const waitingCount = (await db.get("SELECT COUNT(*) as count FROM tickets WHERE status = 'WAITING'"))?.count || 0;

        res.json({
            confirmedAvailable: Math.max(0, TOTAL_CONFIRMED_BERTHS - confirmedCount),
            racAvailable: Math.max(0, (TOTAL_RAC_BERTHS * 2) - racCount),
            waitingAvailable: Math.max(0, TOTAL_WAITING_LIST - waitingCount),
        });
    } catch (error) {
        console.error("Error fetching available tickets:", error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export default {
    bookTicket,
    cancelTicket,
    getBookedTickets,
    getAvailableTickets
};
