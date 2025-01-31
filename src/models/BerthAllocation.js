
import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
const BerthAllocation = sequelize.define("BerthAllocation", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    type: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isIn: [["CONFIRMED", "RAC", "WAITING"]],
        },
    }
}, {
    tableName: "berth_allocations", 
    timestamps: false 
});

export default BerthAllocation;
