const { response } = require("express");
const express = require("express");
const router = express.Router();
const { getFacturas, getFactura, getIngresos, getGastos } = require("../controladores/facturas");


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

module.exports = router;
