const { response } = require("express");
const express = require("express");
const { check, checkSchema } = require("express-validator");
const router = express.Router();
const { getFactura, getIngresos, getGastos, crearFactura, borrarFactura, modificarFactura, sustituirFactura, filtrarPorQueries, facturaCompletaSchema, facturaParcialSchema, compruebaId } = require("../controladores/facturas");
const { badRequestError, idError } = require("../utils/errores");

router.get("/", (req, res, next) => {
  const queries = req.query;
  const respuesta = filtrarPorQueries(queries);
  res.json(respuesta);
});
router.get("/factura/:id",
  check("id", "La factura no existe").custom(compruebaId),
  (req, res, next) => {
    const errorId = idError(req);
    if (errorId) {
      return next(errorId);
    }
    const id = +req.params.id;
    const { factura, error } = getFactura(id);
    if (error) {
      next(error);
    } else {
      res.json(factura);
    }
  });
router.get("/ingresos", (req, res, next) => {
  const respuesta = getIngresos();
  res.json(respuesta);
});
router.get("/gastos", (req, res, next) => {
  const respuesta = getGastos();
  res.json(respuesta);
});
router.post("/",
  checkSchema(facturaCompletaSchema),
  (req, res, next) => {
    const error400 = badRequestError(req);
    if (error400) {
      return next(error400);
    }
    const nuevaFactura = req.body;
    const { factura, error } = crearFactura(nuevaFactura);
    if (error) {
      next(error);
    } else {
      res.json(factura);
    }
  });
router.put("/factura/:id",
  checkSchema(facturaCompletaSchema),
  check("id", "La factura no existe").custom(compruebaId),
  (req, res, next) => {
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
    const { factura, error } = sustituirFactura(idFactura, facturaNueva);
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
  (req, res, next) => {
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
    const { factura, error } = modificarFactura(idFactura, facturaNueva);
    if (error) {
      next(error);
    } else {
      res.json(factura);
    }
  });
router.delete("/factura/:id",
  check("id", "La factura no existe").custom(compruebaId),
  (req, res, next) => {
    const errorId = idError(req);
    if (errorId) {
      return next(errorId);
    }
    const idFactura = +req.params.id;
    const { factura, error } = borrarFactura(idFactura);
    if (error) {
      next(error);
    } else {
      res.json(factura);
    }
  });

module.exports = router;
