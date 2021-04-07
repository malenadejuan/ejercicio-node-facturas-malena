const express = require("express");
const router = express.Router();
const { getFacturas, getFactura } = require("../controladores/facturas");

router.get("/", (req, res, next) => {
  console.log("Hola");
  let facturas = getFacturas();
  res.json(facturas);
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

module.exports = router;
