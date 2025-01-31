import Passenger from "../models/Passenger.js";
import sequelize from "../config/db.js";

const createPassenger = async (passengerData) => {
    return await Passenger.create(passengerData);
};

const getPassengerById = async (id) => {
    return await Passenger.findByPk(id);
};

const getAllPassengers = async () => {
    return await Passenger.findAll();
};

const deletePassenger = async (id) => {
    return await Passenger.destroy({ where: { id } });
};

export default { createPassenger, getPassengerById, getAllPassengers, deletePassenger };
