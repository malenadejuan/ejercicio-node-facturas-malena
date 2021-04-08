const { response } = require("express");
const express = require("express");
const router = express.Router();
const { getFacturas, getFactura, getIngresos, getGastos, crearFactura } = require("../controladores/facturas");
const { mandaErrores } = require("../utils/errores");


router.get("/", (req, res, next) => {
  const respuesta = getFacturas();
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
router.put("/factura/:id", (req, res, next) => { });
router.patch("/factura:id", (req, res, next) => { });

module.exports = router;
