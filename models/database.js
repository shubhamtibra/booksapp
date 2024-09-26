const { Sequelize } = require("sequelize");
const pg = require("pg");
const sequelize = new Sequelize(
  "postgres://shubham:123456789@localhost:5432/books",
  {
    dialect: "postgres",
    dialectModule: pg,
  }
); // Example for postgres
(async function checkConnection() {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ force: false });
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
})();

module.exports = sequelize;
