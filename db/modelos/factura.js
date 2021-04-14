const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const Factura = sequelize.define("Factura", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  numero: {
    type: DataTypes.STRING(15),
    allowNull: false
  },
  fecha: {
    type: DataTypes.STRING(15),
    unique: true,
    allowNull: false
  },
  base: {
    type: DataTypes.FLOAT(10, 2)
  },
  tipoIva: {
    type: DataTypes.INTEGER
  },
  tipo: {
    type: DataTypes.ENUM,
    values: ["ingreso", "gasto"],
    allowNull: false
  },
  abonada: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false
  },
  concepto: DataTypes.TEXT,
  vencimiento: DataTypes.STRING(15)
},
  {
    tableName: "facturas",
    timestamps: false
  });

module.exports = Factura;
