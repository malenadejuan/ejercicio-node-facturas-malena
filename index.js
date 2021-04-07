const debug = require("debug")("facturas:root");
const express = require("express");
const morgan = require("morgan");
const { program } = require("commander");
const facturas = require("./facturas.json");
const { creaError, mandaErrores, notFoundError } = require("./utils/errores");
const chalk = require("chalk");

program.option("-p, --puerto <puerto>", "Puerto para el servidor");
program.parse(process.arg);
const options = program.opts();

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

app.use(morgan("dev"));
app.get("/", (req, res, next) => {
  res.json(facturas);
});
app.get("/factura/:id", (req, res, next) => {
  const { id } = req.params;
  let factura = facturas.facturas.find(factura => factura.id === +id);
  if (factura) {
    res.json(factura);
  } else {
    const error = creaError("La factura no existe", 404);
    next(error);
  }
});
app.use(notFoundError);
app.use(mandaErrores);
