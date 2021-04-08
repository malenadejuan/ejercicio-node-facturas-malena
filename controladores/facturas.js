let facturasJSON = require("../facturas.json").facturas;
const { creaError } = require("../utils/errores");

const facturaSchema = {
  id: {
    exists: {
      errorMessage: "La factura debe tener un id"
    }
  },
  numero: {
    exists: {
      errorMessage: "La factura debe tener un numero"
    }
  },
  fecha: {
    exists: {
      errorMessage: "La factura debe tener una fecha"
    }
  },
  base: {
    isFloat: true,
    exists: {
      errorMessage: "La factura debe tener una base"
    }
  },
  tipoIva: {
    isInt: {
      errorMessage: "El tipo IVA debe ser un número entero"
    },
    exists: {
      errorMessage: "La factura debe tener un tipo IVA"
    }
  },
  tipo: {
    exists: {
      errorMessage: "La factura debe tener un tipo (ingreso o gasto)",
      notEmpty: true,
    }
  },
  abonada: {
    exists: {
      errorMessage: "Se tiene que especificar si está abonada",
    }
  },
  vencimiento: {
    optional: true,
  }
};

let objetoRespuesta = {
  total: null,
  datos: null
};

const compruebaId = idFactura => facturasJSON.find(factura => factura.id === +idFactura);

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
