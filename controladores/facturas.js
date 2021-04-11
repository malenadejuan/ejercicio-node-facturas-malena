let facturasJSON = require("../facturas.json").facturas;
const { creaError } = require("../utils/errores");

const getFacturaSchema = completaOParcial => {
  const id = {
    notEmpty: true
  };
  const numero = {
    isInt: true,
    notEmpty: true,
  };
  const fecha = {
    notEmpty: true
  };
  const base = {
    isFloat: {
      errorMessage: "La base debe ser un número"
    },
    notEmpty: true
  };
  const tipoIva = {
    isInt: {
      errorMessage: "El tipo de IVA debe ser un número entero"
    },
    notEmpty: true
  };
  const tipo = {
    notEmpty: true,
    custom: {
      options: (value => {
        if ((value === "ingreso" || value == "gasto")) {
          return value;
        }
      }),
      errorMessage: "El tipo debe ser ingreso o gasto"
    }
  };
  const abonada = {
    isBoolean: {
      errorMessage: "El valor de abonada debe ser boleano"
    },
    notEmpty: true
  };
  const vencimiento = {
    optional: true,
  };

  switch (completaOParcial) {
    case "completa":
      id.exists = {
        errorMessage: "La factura debe tener un id"
      };
      numero.exists = {
        errorMessage: "La factura debe tener un numero"
      };
      fecha.exists = {
        errorMessage: "La factura debe tener una base"
      };
      base.exists = {
        errorMessage: "La base debe ser un número (puede ser decimal)"
      };
      tipoIva.exists = {
        errorMessage: "El tipo IVA debe ser un número entero"
      };
      tipo.exists = {
        errorMessage: "La factura debe tener un tipo"
      };
      abonada.exists = {
        errorMessage: "La factura debe estar o no estar abonada"
      };
      break;
    case "parcial":
    default:
      id.optional = true;
      numero.optional = true;
      fecha.optional = true;
      base.optional = true;
      tipoIva.optional = true;
      tipo.optional = true;
      abonada.optional = true;
      break;
  }
  return {
    id, numero, fecha, base, tipoIva, tipo, abonada, vencimiento
  };
};

const facturaCompletaSchema = getFacturaSchema("completa");
const facturaParcialSchema = getFacturaSchema("parcial");

let objetoRespuesta = {
  total: null,
  datos: null
};

const compruebaId = idFactura => facturasJSON.find(factura => factura.id === +idFactura);
const filtrarPorQueries = queries => {
  let { total, datos } = getFacturas();
  if (queries.abonadas) {
    if (queries.abonadas === "true") {
      datos = datos.filter(factura => factura.abonada === true);
    } else if (queries.abonadas === "false") {
      datos = datos.filter(factura => factura.abonada === false);
    }
  }
  if (queries.vencidas) {
    let fecha = new Date().getTime();
    if (queries.vencidas === "true") {
      datos = datos.filter(factura => factura.vencimiento < fecha);
    } else if (queries.vencidas === "false") {
      datos = datos.filter(factura => factura.vencimiento > fecha);
    }
  }
  if (queries.ordenPor) {
    if (queries.ordenPor === "fecha") {
      if (queries.orden === "desc") {
        datos = datos.sort((a, b) => b.fecha - a.fecha);
      } else {
        datos = datos.sort((a, b) => a.fecha - b.fecha);
      }
    }
    else if (queries.ordenPor === "base") {
      if (queries.orden === "desc") {
        datos = datos.sort((a, b) => b.base - a.base);
      } else {
        datos = datos.sort((a, b) => a.base - b.base);
      }
    }
  }
  let facturasPorPagina;
  let pagina;
  if (queries.nPorPagina) {
    facturasPorPagina = +queries.nPorPagina;
    if (queries.pagina && queries.pagina !== "0") {
      pagina = +queries.pagina;
      let inicio = (facturasPorPagina * pagina) - facturasPorPagina;
      datos = datos.slice(inicio, (inicio + facturasPorPagina));
    } else {
      datos = datos.slice(0, facturasPorPagina);
    }
  }
  total = datos.length;
  return { total, datos };
};

const getFacturas = () => {
  objetoRespuesta.datos = facturasJSON;
  objetoRespuesta.total = objetoRespuesta.datos.length;
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
const crearFactura = (nuevaFactura) => {
  const respuesta = {
    factura: null,
    error: null
  };
  if (facturasJSON.find(factura => factura.numero === nuevaFactura.numero)) {
    const error = creaError("La factura ya existe", 409);
    respuesta.error = error;
  }
  if (!respuesta.error) {
    facturasJSON.push(nuevaFactura);
    respuesta.factura = nuevaFactura;
  }
  return respuesta;
};
const borrarFactura = idFactura => {
  const facturaABorrar = compruebaId(idFactura);
  const respuesta = {
    factura: facturaABorrar,
    error: null
  };
  facturasJSON = facturasJSON.filter(factura => factura.id !== facturaABorrar.id);
  return respuesta;
};
const sustituirFactura = (idFactura, nuevaFactura) => {
  const facturaASustituir = compruebaId(idFactura);
  let respuesta;
  if (facturaASustituir) {
    respuesta = modificarFactura(idFactura, nuevaFactura);
  } else {
    respuesta = crearFactura(nuevaFactura);
  }
  return respuesta;
};
const modificarFactura = (idFactura, facturaNueva) => {
  const facturaAModificar = compruebaId(idFactura);
  const respuesta = {
    factura: null,
    error: null
  };

  const facturaModificada = {
    ...facturaAModificar,
    ...facturaNueva
  };
  facturasJSON[facturasJSON.indexOf(facturaAModificar)] = facturaModificada;
  respuesta.factura = facturaModificada;
  return respuesta;
};

module.exports = {
  facturaCompletaSchema,
  facturaParcialSchema,
  filtrarPorQueries,
  getFacturas,
  getFactura,
  getIngresos,
  getGastos,
  crearFactura,
  borrarFactura,
  sustituirFactura,
  modificarFactura
};
