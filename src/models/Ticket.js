// import { DataTypes } from "sequelize";
// import sequelize from "../config/db.js";
// import Passenger from "./Passenger.js";

// const Ticket = sequelize.define("Ticket", {
//     id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
//     status: { type: DataTypes.ENUM("CONFIRMED", "RAC", "WAITING"), allowNull: false },
//     berthType: { type: DataTypes.ENUM("LOWER", "MIDDLE", "UPPER", "SIDE-LOWER", "SIDE-UPPER"), allowNull: false }
// });

// Ticket.belongsTo(Passenger, { foreignKey: "passenger_id" });
// export default Ticket;
import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import Passenger from "./Passenger.js";

const Ticket = sequelize.define("Ticket", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isIn: [['CONFIRMED', 'RAC', 'WAITING']]
        }
    },
    berth_type: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isIn: [['LOWER', 'MIDDLE', 'UPPER', 'SIDE-LOWER']]
        }
    },
    berth_type: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isIn: [['LOWER', 'MIDDLE', 'UPPER', 'SIDE-LOWER', 'SIDE-UPPER']]
        }
    }
    
}, {
    timestamps: false
});

Ticket.belongsTo(Passenger, { foreignKey: "passenger_id", onDelete: "CASCADE" });
Passenger.hasOne(Ticket, { foreignKey: "passenger_id" });

export default Ticket;