require("dotenv").config();
const debug = require("debug")("facturas:sql");
const { Op } = require("sequelize");
const Factura = require("../db/modelos/factura");
const { creaError } = require("../utils/errores");

const compruebaId = idFactura => {
  const { factura } = getFactura();
  return factura;
};

const respuesta = datos => ({
  total: datos.length,
  datos
});

const getFacturas = async (queries, tipo) => {
  const hoy = new Date().getTime();
  const condicion = {
    where: {},
    order: [[queries.ordenPor === "fecha" ? "fecha" : (queries.ordenPor === "base" ? "base" : "id")]]
  };
  if (tipo === "ingreso" || tipo === "gasto") {
    condicion.where.tipo = tipo;
  }
  if (queries.abonadas) {
    condicion.where.abonada = queries.abonadas === "true";
  }
  if (queries.vencidas) {
    condicion.where.vencimiento = queries.vencidas === "false" ? { [Op.gt]: hoy } : { [Op.lt]: hoy };
  }
  if (queries.orden === "desc") {
    condicion.order[0].push("DESC");
  }
  if (queries.nPorPagina) {
    condicion.limit = +queries.nPorPagina;
    if (queries.pagina) {
      condicion.offset = (+queries.nPorPagina * +queries.pagina) - +queries.nPorPagina;
    }
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

const crearFactura = async (nuevaFactura) => {
  const respuesta = {
    factura: null,
    error: null
  };
  const facturaRepetida = await Factura.findOne({
    where: {
      numero: nuevaFactura.numero
    }
  });
  if (facturaRepetida) {
    const error = creaError("La factura ya existe", 409);
    respuesta.error = error;
  }
  if (!respuesta.error) {
    Factura.create(nuevaFactura);
    respuesta.factura = nuevaFactura;
  }
  return respuesta;
};

const modificarFactura = async (idFactura, nuevaFactura) => {
  let respuesta = {
    factura: null,
    error: null
  };
  const facturaAModificar = await Factura.findByPk(idFactura);
  if (!facturaAModificar) {
    respuesta.error = creaError("La factura no existe", 404);
  } else {
    respuesta.factura = facturaAModificar;
    Factura.update(nuevaFactura, {
      where: {
        id: idFactura
      }
    });
  }
  return respuesta;
};

const sustituirFactura = async (idFactura, nuevaFactura) => {
  let respuesta = {
    factura: null,
    error: null
  };
  const { factura: facturaAModificar } = await getFactura(idFactura);
  if (facturaAModificar) {
    respuesta = await modificarFactura(idFactura, nuevaFactura);
  } else {
    respuesta = await crearFactura(nuevaFactura);
  }
  return respuesta;
};

const borrarFactura = async (idFactura) => {
  let respuesta = {
    factura: null,
    error: null
  };
  const facturaABorrar = await Factura.findByPk(idFactura);
  if (!facturaABorrar) {
    respuesta.error = creaError("La factura no existe", 404);
  } else {
    respuesta.factura = facturaABorrar;
    Factura.destroy({
      where: {
        id: idFactura
      }
    });
  }
  return respuesta;
};

module.exports = {
  getFacturas,
  getFactura,
  crearFactura,
  modificarFactura,
  sustituirFactura,
  borrarFactura,
  compruebaId
};
