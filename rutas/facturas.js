const express = require("express");
const { check, checkSchema } = require("express-validator");
const router = express.Router();
const { getFactura, getIngresos, getGastos, crearFactura, borrarFactura, modificarFactura, sustituirFactura, filtrarPorQueries, facturaCompletaSchema, facturaParcialSchema, compruebaId: compruebaIdJSON } = require("../controladores/facturas");
const { getFacturas: getFacturasSQL, getFactura: getFacturaSQL, crearFactura: crearFacturaSQL, sustituirFactura: sustituirFacturaSQL, modificarFactura: modificarFacturaSQL, borrarFactura: borrarFacturaSQL, compruebaId: compruebaIdBD } = require("../controladores/facturasSQL");
const options = require("../parametrosCLI");
const { badRequestError, idError } = require("../utils/errores");

let bd = true;
let compruebaId;

if (options.datos === "json") {
  bd = false;
  compruebaId = compruebaIdJSON;
} else if (options.datos === "bd") {
  bd = true;
  compruebaId = compruebaIdBD;
}

router.get("/", async (req, res, next) => {
  const queries = req.query;
  const respuesta = bd ? await getFacturasSQL(queries, "") : filtrarPorQueries(queries);
  res.json(respuesta);
});
router.get("/factura/:id",
  check("id", "La factura no existe").custom(compruebaId),
  async (req, res, next) => {
    const errorId = idError(req);
    if (errorId) {
      return next(errorId);
    }
    const id = +req.params.id;
    const { factura, error } = bd ? await getFacturaSQL(id) : getFactura(id);
    if (error) {
      next(error);
    } else {
      res.json(factura);
    }
  });
router.get("/ingresos", async (req, res, next) => {
  const queries = req.query;
  const respuesta = bd ? await getFacturasSQL(queries, "ingreso") : getIngresos();
  res.json(respuesta);
});
router.get("/gastos", async (req, res, next) => {
  const queries = req.query;
  const respuesta = bd ? await getFacturasSQL(queries, "gasto") : getGastos();
  res.json(respuesta);
});
router.post("/factura",
  checkSchema(facturaCompletaSchema),
  async (req, res, next) => {
    const error400 = badRequestError(req);
    if (error400) {
      console.log(error400);
      return next(error400);
    }
    const nuevaFactura = req.body;
    const { factura, error } = bd ? await crearFacturaSQL(nuevaFactura) : crearFactura(nuevaFactura);
    if (error) {
      next(error);
    } else {
      res.json(factura);
    }
  });
router.put("/factura/:id",
  checkSchema(facturaCompletaSchema),
  check("id", "La factura no existe").custom(compruebaId),
  async (req, res, next) => {
    const errorId = idError(req);
    if (errorId) {
      return next(errorId);
    }
    const error400 = badRequestError(req);
    if (error400) {
      return next(error400);
    }
    const idFactura = +req.params.id;
    const facturaNueva = req.body;
    const { factura, error } = bd ? await sustituirFacturaSQL(idFactura, facturaNueva) : sustituirFactura(idFactura, facturaNueva);
    if (error) {
      next(error);
    } else {
      res.json(factura);
    }
  }
);
router.patch("/factura/:id",
  checkSchema(facturaParcialSchema),
  check("id", "La factura no existe").custom(compruebaId),
  async (req, res, next) => {
    const errorId = idError(req);
    if (errorId) {
      return next(errorId);
    }
    const error400 = badRequestError(req);
    if (error400) {
      return next(error400);
    }
    const idFactura = +req.params.id;
    const facturaNueva = req.body;
    const { factura, error } = bd ? await modificarFacturaSQL(idFactura, facturaNueva) : modificarFactura(idFactura, facturaNueva);
    if (error) {
      next(error);
    } else {
      res.json(factura);
    }
  });
router.delete("/factura/:id",
  check("id", "La factura no existe").custom(compruebaId),
  async (req, res, next) => {
    const errorId = idError(req);
    if (errorId) {
      return next(errorId);
    }
    const idFactura = +req.params.id;
    const { factura, error } = bd ? await borrarFacturaSQL(idFactura) : borrarFactura(idFactura);
    if (error) {
      next(error);
    } else {
      res.json(factura);
    }
  });

module.exports = router;
