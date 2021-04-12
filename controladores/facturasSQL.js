require("dotenv").config();
const debug = require("debug")("facturas:sql");
const Factura = require("../db/modelos/factura");
const { creaError } = require("../utils/errores");

const respuesta = datos => ({
  total: datos.length,
  datos
});

const getFacturas = async (queries, tipo) => {
  const condicion = {
    where: {}
  };
  if (tipo === "ingreso" || tipo === "gasto") {
    condicion.where.tipo = tipo;
  }
  if (queries.abonadas) {
    condicion.where.abonada = queries.abonadas === "true";
  }
  const facturas = await Factura.findAll(condicion);
  console.log("Estoy usando base de datos");
  return respuesta(facturas);
};

const getFactura = async id => {
  const factura = await Factura.findByPk(id);

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
/*
Factura.findAll().then(facturas => {
  facturas.forEach(factura => console.log(factura.toJSON()));
}
);
Factura.findByPk(1).then(factura => console.log(factura.toJSON()));

Factura.findAll({
  where: {
    abonada: true
  }
}).then(facturas => {
  for (const factura of facturas) {
    console.log(factura.toJSON());
  }
}); */

module.exports = {
  getFacturas,
  getFactura
};
