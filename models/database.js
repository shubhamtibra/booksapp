const { Sequelize } = require("sequelize");
const pg = require("pg");
const DB_URL = process.env.DB_URL
  ? process.env.DB_URL
  : "postgres://shubham:123456789@localhost:5432/books";
const sequelize = new Sequelize(DB_URL, {
  dialect: "postgres",
  dialectModule: pg,
});
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
