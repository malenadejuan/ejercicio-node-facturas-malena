const { validationResult } = require("express-validator");
const { facturaSchema } = require("../controladores/facturas");

const creaError = (mensaje, status) => {
  const error = new Error(mensaje);
  error.codigo = status;
  return error;
};

const notFoundError = (req, res, next) => {
  const error = creaError("El endpoint no existe", 404);
  next(error);
};

const badRequestError = (req) => {
  const errores = validationResult(req);
  let error;
  if (!errores.isEmpty()) {
    const mapaErrores = errores.mapped();
    for (let propiedad in facturaSchema) {
      if (mapaErrores[propiedad]) {
        console.log(propiedad);
        error = creaError(`La factura no tiene la forma correcta. ${mapaErrores[propiedad].msg}`, 400);
        console.log(errores.mapped());
      }
    }
  }
  return error;
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
  badRequestError,
  mandaErrores
};
