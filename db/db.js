require("dotenv").config();
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize({
  host: "localhost",
  database: "facturas",
  username: "malena",
  password: "malena",
  dialect: "mysql",
  logging: mensaje => console.log(mensaje)
});

module.exports = sequelize;
