
// import Ticket from "../models/Ticket.js";
// import BerthAllocation from "../models/BerthAllocation.js";
// import ticketRepository from "../repositories/ticketRepository.js";
// import passengerRepository from "../repositories/passengerRepository.js";
// import db from "../config/db.js";


// const bookTicket = async (passengerData) => {
//     return await db.transaction(async (transaction) => {
//         const passenger = await passengerRepository.createPassenger(passengerData, { transaction });
//         let status = "WAITING";
        
//         const isSenior = passengerData.age >= 60;
//         const isWomanWithChild = passengerData.gender === 'Female' && passengerData.hasChild;
//         const confirmedSeats = await BerthAllocation.findOne({ where: { type: "CONFIRMED" } });
//         const racSeats = await BerthAllocation.findOne({ where: { type: "RAC" } });
//         const waitingSeats = await BerthAllocation.findOne({ where: { type: "WAITING" } });

//         if (passengerData.age < 5) {
//             return await passengerRepository.createPassenger(passengerData);
//         }
        

//         if (confirmedSeats && confirmedSeats.availableSeats > 0) {
//             status = "CONFIRMED";
//             await BerthAllocation.update(
//                 { availableSeats: confirmedSeats.availableSeats - 1 },
//                 { where: { type: "CONFIRMED" } }
//             );
//         } else if (racSeats && racSeats.availableSeats > 0) {
//             status = "RAC";
//             await BerthAllocation.update(
//                 { availableSeats: racSeats.availableSeats - 1 },
//                 { where: { type: "RAC" } }
//             );
//         } else if (!waitingSeats || waitingSeats.availableSeats <= 0) {
//             return { error: "No available seats" };  
//         }
//         if (!waitingSeats || waitingSeats.availableSeats <= 0) {
//             throw new Error("No tickets available"); 
//         }

//         const validBerthTypes = ["LOWER", "MIDDLE", "UPPER", "SIDE-LOWER", "SIDE-UPPER"];
//         let berthType = "LOWER";

//         if (isSenior) {
//             berthType = "LOWER"; 
//         } else if (isWomanWithChild) {
//             berthType = "MIDDLE"; 
//         } else {
//             berthType = validBerthTypes[Math.floor(Math.random() * validBerthTypes.length)];
//         }

//         if (!validBerthTypes.includes(berthType)) {
//             console.error("Invalid berthType:", berthType);
//             return { error: "Invalid berth type assigned" }; 
//         }

//         return await ticketRepository.createTicket({ 
//             passenger_id: passenger.id, 
//             status: status, 
//             berth_type: berthType 
//         }, { transaction });
//     });
// };

// export default { bookTicket };
import Ticket from "../models/Ticket.js";
import ticketRepository from "../repositories/ticketRepository.js";
import passengerRepository from "../repositories/passengerRepository.js";
import db from "../config/db.js";
import seatAllocator from "../utils/seatAllocationHelper.js";

const bookTicket = async (passengerData) => {
  return await db.transaction(async (transaction) => {
    const passenger = await passengerRepository.createPassenger(passengerData, { transaction });

    if (passengerData.age < 5) {
      // No seat allocation, just store passenger data
      return { message: "Child under 5 - passenger stored without ticket", passengerId: passenger.id };
    }

    // Allocate seat and berth using helper
    const { status, berthType: defaultBerthType } = await seatAllocator.allocateSeatAndBerth(passengerData);

    if (!status || !defaultBerthType) {
      throw new Error("Unable to allocate seat or berth");
    }

    // Explicit RAC berth override
    const berthType = status === "RAC" ? "SIDE-LOWER" : defaultBerthType;

    const ticket = await ticketRepository.createTicket({
      passenger_id: passenger.id,
      status,
      berth_type: berthType
    }, { transaction });

    return {
      message: "Ticket booked successfully",
      ticket,
      passengerId: passenger.id,
      status,
      berthType
    };
  });
};

export default {
  bookTicket
};
