const debug = require("debug")("proyectos:control");
const chalk = require("chalk");
const { updateOne } = require("../db/modelos/proyecto");
const Proyecto = require("../db/modelos/proyecto");
const { creaError } = require("../utils/errores");

const respuesta = proyectos => ({
  total: proyectos.length,
  proyectos
});

const getProyectos = async (queries, tipo) => {
  const hoy = new Date().getTime();
  const condicion = {};
  if (tipo) {
    condicion.estado = tipo;
  }
  if (queries.tecnologias) {
    let tecnologias = queries.tecnologias.split(",");
    condicion.tecnologias = { $all: tecnologias };
  }
  if (queries.vencidos) {
    condicion.entrega = queries.vencidos === "false" ? { $gt: hoy } : { $lt: hoy };
  }
  const direccion = queries.orden === "DESC" ? -1 : 1;
  const campo = queries.ordenPor === "fecha" ? "entrega" : "nombre";
  const proyectos = await Proyecto
    .find(condicion)
    .sort({ [campo]: direccion })
    .limit(queries.nPorPagina ? +queries.nPorPagina : 0)
    .skip(queries.nPorPagina && queries.pagina ? (+queries.nPorPagina * +queries.pagina) - +queries.nPorPagina : 0);
  return respuesta(proyectos);
};

const getProyecto = async (idProyecto) => {
  let respuesta = {};
  const proyecto = await Proyecto
    .findById(idProyecto)
    .catch(err => debug(chalk.red.bold(err)));
  if (proyecto) {
    respuesta.proyecto = proyecto;
  } else {
    const error = creaError("El proyecto no existe", 404);
    respuesta.error = error;
  }
  return respuesta;
};

const crearProyecto = async (nuevoProyecto) => {
  let respuesta = {};
  const proyectoRepetido = await Proyecto
    .findOne({
      nombre: nuevoProyecto.nombre
    })
    .catch(err => debug(chalk.red.bold(err)));
  if (proyectoRepetido) {
    const error = creaError("El proyecto ya existe", 409);
    respuesta.error = error;
  } else {
    const nuevoProyectoBD = await Proyecto.create(nuevoProyecto);
    respuesta.proyecto = nuevoProyectoBD;
  }
  return respuesta;
};

const sustituirProyecto = async (idProyecto, nuevoProyecto) => {
  let respuesta = {};
  const proyectoEncontrado = await Proyecto
    .findById(idProyecto)
    .catch(err => debug(chalk.red.bold(err)));
  if (proyectoEncontrado) {
    await proyectoEncontrado.updateOne(nuevoProyecto);
    respuesta.proyecto = nuevoProyecto;
  } else {
    const proyectoNuevo = await crearProyecto(nuevoProyecto);
    respuesta = proyectoNuevo;
  }
  return respuesta;
};

const modificarProyecto = async (idProyecto, cambios) => {
  let respuesta = {};
  const proyectoModificado = await Proyecto
    .findByIdAndUpdate(idProyecto, cambios)
    .catch(err => debug(chalk.red.bold(err)));
  if (proyectoModificado) {
    respuesta.proyecto = proyectoModificado;
  } else {
    const error = creaError("El proyecto modificado no existe", 404);
    respuesta.error = error;
  }
  return respuesta;
};

const borrarProyecto = async (idProyecto) => {
  let respuesta = {};
  const proyectoBorrado = await Proyecto
    .findByIdAndDelete(idProyecto)
    .catch(err => debug(chalk.red.bold(err)));
  if (proyectoBorrado) {
    respuesta.proyecto = proyectoBorrado;
  } else {
    const error = creaError("La factura no existe", 404);
    respuesta.error = error;
  }
  return respuesta;
};

module.exports = {
  getProyectos,
  getProyecto,
  crearProyecto,
  sustituirProyecto,
  modificarProyecto,
  borrarProyecto
};
