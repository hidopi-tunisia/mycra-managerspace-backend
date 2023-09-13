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
// clients/clients?page=2&limit=5

router.get("/clients", async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1; // Par défaut, la première page
      const limit = parseInt(req.query.limit) || 10; // Par défaut, 10 clients par page
  
      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;
  
      // Récupérer les clients avec pagination
      const clients = await Client.find().skip(startIndex).limit(limit);
  
      // Obtenir le nombre total de clients
      const totalClients = await Client.countDocuments();
  
      // Calculer le nombre total de pages
      const totalPages = Math.ceil(totalClients / limit);
  
      res.json({ clients, totalClients, totalPages });
    } catch (error) {
      res.status(500).json({ message: "Erreur lors de la récupération des clients" });
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
    res.status(500).json({
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
router.get("/nb-projects-client/:clientId/nombre-projets", async (req, res) => {
    try {
      const clientId = req.params.clientId;
  
      const client = await Client.findById(clientId);
  
      if (!client) {
        return res.status(404).json({ message: "Client introuvable" });
      }
  
      const nombreProjets = client.projets.length;
  
      res.json({ nombreProjets });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Erreur lors du calcul du nombre de projets du client" });
    }
  });
  
//Nombre des consultants qui sont affectés à ce client
// Endpoint pour obtenir le nombre de consultants travaillant chez un client précis
router.get("/clients/:clientId/nombre-consultants", async (req, res) => {
  try {
    const clientId = req.params.clientId;

    // Recherche du client par son ID
    const client = await Client.findById(clientId);

    if (!client) {
      return res.status(404).json({ message: "Client introuvable" });
    }

    // Obtention du nombre de consultants dans le tableau 'consultants' du client
    const nombreConsultants = client.consultants.length;

    res.json({ nombreConsultants });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Erreur lors du calcul du nombre de consultants" });
  }
});

// Liste des consultants travaillant chez ce client
router.get("/liste-consultants/:clientId/consultants", async (req, res) => {
  try {
    const clientId = req.params.clientId;

    // Rechercher le client dans la base de données
    const client = await Client.findById(clientId).populate("consultants");

    if (!client) {
      return res.status(404).json({ message: "Client introuvable" });
    }

    // Récupérer la liste des consultants affectés au client
    const consultants = client.consultants;

    res.json({ consultants });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({
        message: "Erreur lors de la récupération des consultants du client",
      });
  }
});

// Supprimer un consultant d'un client
router.delete(
  "/supp-consultant/:clientId/supprimer-consultant/:consultantId",
  async (req, res) => {
    try {
      const { clientId, consultantId } = req.params;

      const [client, consultant] = await Promise.all([
        Client.findById(clientId),
        Consultant.findById(consultantId),
      ]);

      if (!client || !consultant) {
        return res
          .status(404)
          .json({ message: "Client ou consultant introuvable" });
      }

      // Vérifier si le consultant est bien affecté au client
      if (!client.consultants.includes(consultantId)) {
        return res
          .status(400)
          .json({ message: "Le consultant n'est pas affecté à ce client" });
      }

      // Supprimer le consultant de la liste des consultants du client
      client.consultants = client.consultants.filter(
        (id) => id.toString() !== consultantId
      );
      await client.save();

      res.json({ message: "Consultant supprimé du client avec succès" });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({
          message: "Erreur lors de la suppression du consultant du client",
        });
    }
  }
);

module.exports = router;
