const express = require("express");

const router = express.Router();
const Projet = require("../models/projet");
const Client = require("../models/client");
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

router.put("/affecter-projet/:clientId/:projetId", async (req, res) => {
  try {
    const { clientId, projetId } = req.params;

    const [client, projet] = await Promise.all([
      Client.findById(clientId),
      Projet.findById(projetId),
    ]);

    if (!client || !projet) {
      return res.status(404).json({ message: "Client ou projet introuvable" });
    }

    client.projets.push(projetId);
    projet.client = clientId;

    await Promise.all([client.save(), projet.save()]);

    res.json({ message: "Projet affecté au client avec succès" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Erreur lors de l'affectation du projet au client" });
  }
});

router.get("/nombre-projets", async (req, res) => {
  try {
    const count = await Projet.countDocuments();
    res.json({ count });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Erreur lors du calcul du nombre de projets" });
  }
});

router.get("/projets-client/:idClient", async (req, res) => {
    try {
      const idClient = req.params.idClient;
      const projets = await Projet.find({ client: idClient }).populate("client");
      res.json({ projets });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Erreur lors de la récupération des projets du client" });
    }
  });
  
// les projets d'un client précis
// les projets dont le status est archivé
module.exports = router;
