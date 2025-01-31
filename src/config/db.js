
import { Sequelize } from "sequelize";

const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: "./src/database/railway.db", 
    logging: false, 
});

export default sequelize;
