const { response } = require("express");
const express = require("express");
const { check } = require("express-validator");
const router = express.Router();
const { getFacturas, getFactura, getIngresos, getGastos, crearFactura, borrarFactura, modificarFactura, sustituirFactura, filtrarPorQueries } = require("../controladores/facturas");
const { mandaErrores } = require("../utils/errores");


router.get("/", (req, res, next) => {
  const queries = req.query;
  const respuesta = filtrarPorQueries(queries);
  res.json(respuesta);
});
router.get("/factura/:id", (req, res, next) => {
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
router.post("/", (req, res, next) => {
  const nuevaFactura = req.body;
  const { factura, error } = crearFactura(nuevaFactura);
  if (error) {
    next(error);
  } else {
    res.json(factura);
  }
});
router.put("/factura/:id", (req, res, next) => {
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
router.patch("/factura/:id", (req, res, next) => {
  const idFactura = +req.params.id;
  const facturaNueva = req.body;
  const { factura, error } = modificarFactura(idFactura, facturaNueva);
  if (error) {
    next(error);
  } else {
    res.json(factura);
  }
});
router.delete("/factura/:id", (req, res, next) => {
  const idFactura = +req.params.id;
  const { factura, error } = borrarFactura(idFactura);
  if (error) {
    next(error);
  } else {
    res.json(factura);
  }
});

module.exports = router;
