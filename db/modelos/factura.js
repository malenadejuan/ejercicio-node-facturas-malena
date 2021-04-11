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
    unique: true,
    allowNull: false
  },
  fecha: {
    type: DataTypes.DATEONLY,
  },
  base: {
    type: DataTypes.FLOAT(10, 2)
  },
  tipoIva: {
    type: DataTypes.INTEGER
  },
  tipo: {
    type: DataTypes.ENUM,
    values: ["ingreso", "gasto"]
  },
  abonada: {
    type: DataTypes.BOOLEAN,
    defaultValue: 0
  },
  concepto: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  vencimiento: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
},
  {
    tableName: "facturas",
    timestamps: false
  });

module.exports = Factura;
