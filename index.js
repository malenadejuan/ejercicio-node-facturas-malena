const debug = require("debug")("facturas:root");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const { program } = require("commander");
const facturas = require("./facturas.json");
const { creaError, mandaErrores, notFoundError } = require("./utils/errores");
const chalk = require("chalk");
const { getFactura, getFacturas } = require("./controladores/facturas");
const { response } = require("express");

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

app.use(cors());
app.use(morgan("dev"));
app.get("/", (req, res, next) => {
  let facturas = getFacturas();
  res.json(facturas);
});
app.get("/factura/:id", (req, res, next) => {
  const id = +req.params.id;
  const { factura, error } = getFactura(id);
  if (error) {
    next(error);
  } else {
    res.json(factura);
  }
});
app.use(notFoundError);
app.use(mandaErrores);
