const Proyecto = require("../db/modelos/proyecto");

const respuesta = proyectos => ({
  total: proyectos.length,
  proyectos
});

const getProyectos = async (queries) => {
  const hoy = new Date().getTime();
  const condicion = {};
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

module.exports = {
  getProyectos
};
