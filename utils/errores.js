const debug = require("debug");
const chalk = require("chalk");

const creaError = (mensaje, status) => {
  const error = new Error(mensaje);
  error.codigo = status;
  return error;
};

const notFoundError = (req, res, next) => {
  const error = creaError("El endpoint no existe", 404);
  next(error);
};

const mandaErrores = (err, req, res, next) => {
  const error = {
    codigo: err.codigo || 500,
    mensaje: err.codigo ? err.message : "Ha ocurrido un error general"
  };
  res.status(error.codigo).json({ error: true, mensaje: error.mensaje });
};

module.exports = {
  creaError,
  notFoundError,
  mandaErrores
};
