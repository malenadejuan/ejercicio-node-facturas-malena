require("dotenv").config();
const debug = require("debug")("facturas:pruebasDB");
const { Op } = require("sequelize");

const Factura = require("./db/modelos/factura");

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
});
