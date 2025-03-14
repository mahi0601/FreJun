import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import ticketRoutes from "./src/routes/ticketRoutes.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());


app.use("/api/v1/tickets", ticketRoutes);


app.get("/", (_req, res) => {
    res.send("Welcome to the Railway Ticket Reservation API");
});

export default app;
