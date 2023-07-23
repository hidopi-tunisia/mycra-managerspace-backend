const express = require("express");

const router = express.Router();
const Client = require("../models/client");
const Consultant = require("../models/consultant");
const Projet = require("../models/projet");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

router.get("/", function (req, res, next) {
  res.send("La liste des clients dun manager");
});

// Endpoint pour créer un nouveau client
router.post("/clients", async (req, res) => {
  try {
    const clientData = req.body;
    const client = new Client(clientData);
    await client.save();

    res.status(201).json({ message: "Client créé avec succès", client });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Erreur lors de la création du client" });
  }
});

// Endpoint pour mettre à jour les informations d'un client
router.put("/update-client/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const clientData = req.body;

    const client = await Client.findByIdAndUpdate(id, clientData, {
      new: true,
    });

    if (!client) {
      return res.status(404).json({ message: "Client introuvable" });
    }

    res.json({ message: "Client mis à jour avec succès", client });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Erreur lors de la mise à jour du client" });
  }
});

// Endpoint pour afficher la liste de tous les clients
router.get("/clients", async (req, res) => {
  try {
    const clients = await Client.find();
    res.json(clients);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération des clients" });
  }
});

// Endpoint pour afficher les détails d'un client spécifique
router.get("/client-byid/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const client = await Client.findById(id).populate("projets");

    if (!client) {
      return res.status(404).json({ message: "Client introuvable" });
    }

    res.json(client);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération du client" });
  }
});

// Endpoint pour supprimer un client
router.delete("/supp-client/:id", async (req, res) => {
  try {
    const id = req.params.id;

    const client = await Client.findByIdAndRemove(id);

    if (!client) {
      return res.status(404).json({ message: "Client introuvable" });
    }

    res.json({ message: "Client supprimé avec succès" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Erreur lors de la suppression du client" });
  }
});

// Endpoint pour affecter un projet à un client
router.post("/affecter-projet/:id/affecter-projet", async (req, res) => {
  try {
    const id = req.params.id;
    const projetId = req.body.projetId;

    const client = await Client.findById(id);

    if (!client) {
      return res.status(404).json({ message: "Client introuvable" });
    }

    client.projets.push(projetId);
    await client.save();

    res.json({ message: "Projet affecté au client avec succès", client });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Erreur lors de l'affectation du projet au client" });
  }
});

// Endpoint pour afficher la liste des projets d'un client
router.get("/projets-client/:id/projets", async (req, res) => {
  try {
    const id = req.params.id;
    const client = await Client.findById(id).populate("projets");

    if (!client) {
      return res.status(404).json({ message: "Client introuvable" });
    }

    res.json(client.projets);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({
        message: "Erreur lors de la récupération des projets du client",
      });
  }
});

// Endpoint pour calculer le nombre total de clients
router.get("/nombre-clients", async (req, res) => {
  try {
    const count = await Client.countDocuments();
    res.json({ count });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Erreur lors du calcul du nombre de clients" });
  }
});

//Nombre des projets d'un client

//Nombre des consultants qui sont affectés à ce client
router.get("/clients/:clientId/nombre-consultants", async (req, res) => {
    try {
      const clientId = req.params.clientId;
  
      // Recherche du client en fonction de son ID
      const client = await Client.findById(clientId);
  
      if (!client) {
        return res.status(404).json({ message: "Client introuvable" });
      }
  
      // Recherche des projets associés à ce client
      const projets = await Projet.find({ client: clientId });
  
      let nombreConsultants = 0;
  
      // Pour chaque projet, compter le nombre de consultants qui y travaillent
      for (const projet of projets) {
        nombreConsultants += projet.consultants.length;
      }
  
      res.json({ nombreConsultants });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Erreur lors du calcul du nombre de consultants" });
    }
  });

  // Liste des consultants travaillant chez ce client

module.exports = router;
