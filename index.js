require("dotenv").config();
const debug = require("debug")("facturas:root");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const { program } = require("commander");
const chalk = require("chalk");
const options = require("./parametrosCLI");
const { mandaErrores, notFoundError } = require("./utils/errores");
const rutasFacturas = require("./rutas/facturas");
const rutasProyectos = require("./rutas/proyectos");

const app = express();

const puerto = options.puerto || process.env.PUERTO || 5000;

const server = app.listen(puerto, () => {
  debug(`Servidor levantado en el puerto ${puerto}`);
});

server.on("error", err => {
  debug(chalk.red.bold("Ha ocurrido un error en el servidor"));
  if (err.code === "EADDRINUSE") {
    debug(chalk.red.bold(`El puerto ${puerto} está ocupado.`));
  }
});

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use("/facturas", rutasFacturas);
app.get("/", (req, res, next) => {
  res.redirect("/facturas");
});
app.use("/proyectos", rutasProyectos);
app.use(notFoundError);
app.use(mandaErrores);
