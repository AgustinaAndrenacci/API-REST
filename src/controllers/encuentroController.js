const Encuentro = require("../models/encuentroModel");

exports.getAllEncuentros = (req, res) => {
  res.json(Encuentro.getAll());
};

exports.getEncuentroById = (req, res) => {
  const id = parseInt(req.params.id);
  const encuentro = Encuentro.getById(id);
  if (!encuentro) return res.status(404).json({ error: "encuentro no encontrado (No pun Intneded)" });
  res.json(encuentro);
};

exports.createEncuentro = (req, res) => {
  const { tipo,capacidad,juego} = req.body;
  if (!tipo || !capacidad ||!juego) {
    return res.status(400).json({ error: "Faltan campos obligatorios" });
  }
  const nueva = Encuentro.create({ tipo,capacidad, juego });
  res.status(201).json(nueva);
};

exports.updateEncuentro = (req, res) => {
  const id = parseInt(req.params.id);
  const actualizada = Encuentro.update(id, req.body);
  if (!actualizada) return res.status(404).json({ error: "encuentro no encontrado" });
  res.json(actualizada);
};

exports.deleteEncuentro = (req, res) => {
  const id = parseInt(req.params.id);
  const eliminada = Encuentro.remove(id);
  if (!eliminada) return res.status(404).json({ error: "encuentro no encontrado" });
  res.json({ message: "encuentro eliminado" });
};