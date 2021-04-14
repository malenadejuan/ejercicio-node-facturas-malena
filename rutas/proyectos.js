const express = require("express");
const { getProyectos } = require("../controladores/proyectos");
const router = express.Router();

router.get("/", async (req, res, next) => {
  const queries = req.query;
  const respuesta = await getProyectos(queries, null);
  res.json(respuesta);
});
router.get("/pendientes", async (req, res, next) => {
  const queries = req.query;
  const respuesta = await getProyectos(queries, "pendiente");
  res.json(respuesta);
});
router.get("/en-progreso", async (req, res, next) => {
  const queries = req.query;
  const respuesta = await getProyectos(queries, "wip");
  res.json(respuesta);
});
router.get("/finalizados", async (req, res, next) => {
  const queries = req.query;
  const respuesta = await getProyectos(queries, "finalizado");
  res.json(respuesta);
});
router.get("/proyecto/:idProyecto", (req, res, next) => {
  const respuesta = "Detalle de un proyecto a partir de su id";
  res.json(respuesta);
});
router.post("/proyecto", (req, res, next) => {
  const respuesta = "Añadir nuevo proyecto (devoliendo el nuevo proyecto)";
  res.json(respuesta);
});
router.put("/proyecto/:idProyecto", (req, res, next) => {
  const respuesta = "Sustituir un proyecto por otro a partir de su id, devuelve el proyecto nuevo";
  res.json(respuesta);
});
router.patch("/proyecto/:idProyecto", (req, res, next) => {
  const respuesta = "Modificar una parte de un proyecto a partir de su id, devuelve el proyecto modificado";
  res.json(respuesta);
});
router.delete("/proyecto/:idProyecto", (req, res, next) => {
  const respuesta = "Borrar un proyecto a partir de su id, devuelve el proyecto borrado";
  res.json(respuesta);
});

module.exports = router;
