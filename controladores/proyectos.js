const chalk = require("chalk");
const Proyecto = require("../db/modelos/proyecto");
const { creaError } = require("../utils/errores");

const respuesta = proyectos => ({
  total: proyectos.length,
  proyectos
});
const respuestaOError = {
  proyecto: null,
  error: null
};

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
  let proyecto = await Proyecto.findById(idProyecto);
  respuestaOError.proyecto = proyecto;
  return respuestaOError;
};

const crearProyecto = async (nuevoProyecto) => {
  const proyectoRepetido = await Proyecto.findOne({
    nombre: nuevoProyecto.nombre
  });
  if (proyectoRepetido) {
    const error = creaError("El proyecto ya existe", 409);
    respuesta.error = error;
  } else {
    const nuevoProyectoBD = await Proyecto.create(nuevoProyecto);
    respuesta.proyecto = nuevoProyectoBD;
  }
  return respuesta;
};

module.exports = {
  getProyectos,
  getProyecto,
  crearProyecto
};
