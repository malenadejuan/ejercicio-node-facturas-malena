let facturasJSON = require("../facturas.json").facturas;
const { creaError } = require("../utils/errores");

let objetoRespuesta = {
  total: null,
  datos: null
};

const getFacturas = () => {
  objetoRespuesta.datos = facturasJSON;
  objetoRespuesta.total = objetoRespuesta.length;
  return objetoRespuesta;
};
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
const getIngresos = () => {
  objetoRespuesta.datos = facturasJSON.filter(factura => factura.tipo === "ingreso");
  objetoRespuesta.total = objetoRespuesta.datos.length;
  return objetoRespuesta;
};
const getGastos = () => {
  objetoRespuesta.datos = facturasJSON.filter(factura => factura.tipo === "gasto");
  objetoRespuesta.total = objetoRespuesta.datos.length;
  return objetoRespuesta;
};
module.exports = {
  getFacturas,
  getFactura,
  getIngresos,
  getGastos
};
