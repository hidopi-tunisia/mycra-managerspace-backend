const express = require("express");

const router = express.Router();
const Projet = require("../models/projet");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

router.post("/create-projet", async (req, res) => {
  try {
    const {
      nom,
      description,
      dateDebut,
      dateFin,
      client,
      categorie,
      codeProjet,
    } = req.body;
    const projet = await Projet.create({
      nom,
      description,
      dateDebut,
      dateFin,
      client,
      categorie,
      codeProjet,
    });
    res.json(projet);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Erreur lors de la création du projet" });
  }
});

router.put("/modifier-projet/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const {
      nom,
      description,
      dateDebut,
      dateFin,
      client,
      categorie,
      codeProjet,
    } = req.body;
    const projet = await Projet.findByIdAndUpdate(
      id,
      { nom, description, dateDebut, dateFin, client, categorie, codeProjet },
      { new: true }
    );
    res.json(projet);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Erreur lors de la mise à jour du projet" });
  }
});

router.get("/projet/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const projet = await Projet.findById(id).populate("client consultants");
    res.json(projet);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Erreur lors de la récupération des détails du projet",
    });
  }
});

router.get("/projets", async (req, res) => {
  try {
    const projets = await Projet.find().populate("client");
    res.json(projets);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération des projets" });
  }
});

router.delete("/supp-projet/:id", async (req, res) => {
  try {
    const id = req.params.id;
    await Projet.findByIdAndDelete(id);
    res.json({ message: "Projet supprimé avec succès" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Erreur lors de la suppression du projet" });
  }
});

// les projets d'un client précis
// les projets dont le status est archivé
module.exports = router;
