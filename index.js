const debug = require("debug")("facturas:root");
const express = require("express");
const morgan = require("morgan");
const { program } = require("commander");
const facturas = require("./facturas.json");

program.option("-p, --puerto <puerto>", "Puerto para el servidor");
program.parse(process.arg);
const options = program.opts();

const app = express();

const puerto = options.puerto || process.env.PUERTO || 5000;

const server = app.listen(puerto, () => {
  debug(`Servidor levantado en el puerto ${puerto}`);
});

app.use(morgan("dev"));
app.get("/", (req, res, next) => {
  res.json(facturas);
});
app.get("/factura/:id", (req, res, next) => {
  const { id } = req.params;
  let factura = facturas.facturas.find(factura => factura.id === +id);
  res.json(factura);
});
