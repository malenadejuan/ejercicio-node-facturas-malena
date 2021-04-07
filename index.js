const debug = require("debug")("facturas:root");
const express = require("express");
const morgan = require("morgan");
const { program } = require("commander");

program.option("-p, --puerto <puerto>", "Puerto para el servidor");
program.parse(process.arg);
const options = program.opts();

const app = express();

const puerto = options.puerto || process.env.PUERTO || 5000;

const server = app.listen(puerto, () => {
  debug(`Servidor levantado en el puerto ${puerto}`);
});
