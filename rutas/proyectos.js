const express = require("express");
const { check } = require("express-validator");
const { getProyectos, getProyecto, compruebaId, crearProyecto, borrarProyecto, modificarProyecto, sustituirProyecto } = require("../controladores/proyectos");
const { idError } = require("../utils/errores");
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
router.get("/proyecto/:idProyecto", async (req, res, next) => {
  const id = req.params.idProyecto;
  const respuesta = await getProyecto(id);
  if (respuesta.error) {
    next(respuesta.error);
  } else {
    res.json(respuesta.proyecto);
  }
});
router.post("/proyecto", async (req, res, next) => {
  const nuevoProyecto = req.body;
  const respuesta = await crearProyecto(nuevoProyecto);
  if (respuesta.error) {
    next(respuesta.error);
  } else {
    res.json(respuesta.proyecto);
  }
});
router.put("/proyecto/:idProyecto", async (req, res, next) => {
  const idProyecto = req.params.idProyecto;
  const nuevoProyecto = req.body;
  const respuesta = await sustituirProyecto(idProyecto, nuevoProyecto);
  if (respuesta.error) {
    next(respuesta.error);
  } else {
    res.json(respuesta);
  }
});
router.patch("/proyecto/:idProyecto", async (req, res, next) => {
  const idProyecto = req.params.idProyecto;
  const cambios = req.body;
  const respuesta = await modificarProyecto(idProyecto, cambios);
  if (respuesta.error) {
    next(respuesta.error);
  } else {
    res.json(respuesta);
  }
});
router.delete("/proyecto/:idProyecto", async (req, res, next) => {
  const idProyecto = req.params.idProyecto;
  const respuesta = await borrarProyecto(idProyecto);
  if (respuesta.error) {
    next(respuesta.error);
  } else {
    res.json(respuesta);
  }
});

module.exports = router;
