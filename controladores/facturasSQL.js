require("dotenv").config();
const debug = require("debug")("facturas:sql");
const Factura = require("../db/modelos/factura");

const respuestaListados = datos => ({
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
  return respuestaListados(facturas);
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
  getFacturas
};
