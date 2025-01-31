import BerthAllocation from "../models/BerthAllocation.js";

const allocateSeat = async () => {
    const confirmedSeats = await BerthAllocation.findOne({ where: { type: "CONFIRMED" } });
    const racSeats = await BerthAllocation.findOne({ where: { type: "RAC" } });
    const waitingSeats = await BerthAllocation.findOne({ where: { type: "WAITING" } });
    if (isSenior) {
        berthType = "LOWER"; 
    } else if (isWomanWithChild && availableLowerBerths > 0) {
        berthType = "LOWER";  
    } else {
        berthType = validBerthTypes[Math.floor(Math.random() * validBerthTypes.length)];
    }
    
    if (confirmedSeats.availableSeats > 0) {
        await BerthAllocation.update({ availableSeats: confirmedSeats.availableSeats - 1 }, { where: { type: "CONFIRMED" } });
        return "CONFIRMED";
    } else if (racSeats.availableSeats > 0) {
        await BerthAllocation.update({ availableSeats: racSeats.availableSeats - 1 }, { where: { type: "RAC" } });
        return "RAC";
    } else if (waitingSeats.availableSeats > 0) {
        await BerthAllocation.update({ availableSeats: waitingSeats.availableSeats - 1 }, { where: { type: "WAITING" } });
        return "WAITING";
    } else {
        throw new Error("No tickets available");
    }
};

export default { allocateSeat };
