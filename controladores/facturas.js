let facturasJSON = require("../facturas.json").facturas;
const { creaError } = require("../utils/errores");

const getFacturas = () => facturasJSON;
const getFactura = id => {
  const factura = facturasJSON.find(factura => factura.id === id);
  const respuesta = {
    factura: null,
    error: null
  };
  if (factura) {
    respuesta.factura = factura;
  } else {
    const error = creaError("La factura no existe", 404);
    respuesta.error = error;
  }
  return respuesta;
};

module.exports = {
  getFacturas,
  getFactura
};
