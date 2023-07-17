const express = require("express");

const router = express.Router();
const Consultant = require("../models/consultant");
const Projet = require ('../models/projet')
const CRA = require("../models/cra");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

router.post("/login", async (req, res) => {
  data = req.body;

  user = await Consultant.findOne({ email: data.email });
  if (!user) {
    res.status(404).send(" email or password invalid !");
  } else {
    validPass = bcrypt.compareSync(data.password, user.password);
    if (!validPass) {
      res.status(401).send(" email or password invalid !");
    } else {
      payload = {
        _id: user._id,
        email: user.email,
        name: user.name,
      };
      token = jwt.sign(payload, "1234");
      res.status(200).send({ mytoken: token });
    }
  }

  usr
    .save()
    .then((savedUser) => {
      res.status(200).send(savedUser);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});

// Création d'un consultant
router.post("/create-consultant", async (req, res) => {
  try {
    const {
      civilite,
      nom,
      prenom,
      email,
      dateDisponibilite,
      dateEmbauche,
      dossierCompetence,
      linkedin,
      competences,
      poste,
      anneesExperience,
      numeroTelephone,
      note,
      photoUrl,
    } = req.body;

    // Créer un nouvel objet Consultant avec les données fournies
    const consultant = new Consultant({
      civilite,
      nom,
      prenom,
      email,
      dateDisponibilite,
      dateEmbauche,
      dossierCompetence,
      linkedin,
      competences,
      poste,
      anneesExperience,
      numeroTelephone,
      note,
      photoUrl,
    });

    // Sauvegarder le consultant dans la base de données
    const savedConsultant = await consultant.save();

    res.json({
      message: "Consultant créé avec succès",
      consultant: savedConsultant,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Erreur lors de la création du consultant" });
  }
});

// Modification d'un consultant
router.put("/modifier-consultant/:id", async (req, res) => {
  const id = req.params.id;
  const newData = req.body;

  try {
    const consultant = await Consultant.findByIdAndUpdate(id, newData, {
      new: true,
    });

    if (!consultant) {
      return res.status(404).json({ message: "Consultant introuvable" });
    }

    res.json({
      message: "Données du consultant modifiées avec succès",
      consultant,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({
        message: "Erreur lors de la modification des données du consultant",
      });
  }
});

// Affichage de Tous les Consultants 
router.get("/getall-consultants", async (req, res) => {
  try {
    consultants = await Consultant.find();
    res.send(consultants);
  } catch (error) {
    res.send(error);
  }
});

// Cet endpoint prend en compte l'ID du consultant et l'ID du projet comme paramètres de requête.
//  Il recherche le consultant et le projet correspondants à ces IDs en utilisant les méthodes findById de Mongoose. 
// Si l'un ou l'autre n'est pas trouvé, il renvoie une réponse avec un statut 404.

router.put("/affecter-consultant-projet/:consultantId/:projetId", async (req, res) => {
    const consultantId = req.params.consultantId;
    const projetId = req.params.projetId;
  
    try {
      const consultant = await Consultant.findById(consultantId);
      const projet = await Projet.findById(projetId);
  
      if (!consultant || !projet) {
        return res.status(404).json({ message: "Consultant ou projet introuvable" });
      }
  
      consultant.projet.push(projetId);
      await consultant.save();
  
      res.json({ message: "Consultant affecté au projet avec succès", consultant });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Erreur lors de l'affectation du consultant au projet" });
    }
  });

router.get("/consultant/:id", async (req, res) => {
  try {
    const consultantId = req.params.id;

    const consultant = await Consultant.findById(consultantId)
      .populate({
        path: "projet",
        select: "nomProjet",
      })
      .select("-__v"); // Exclure le champ "__v" de la réponse

    if (!consultant) {
      return res.status(404).json({ message: "Consultant introuvable" });
    }

    const { _id, ...consultantData } = consultant.toObject();

    res.json({
      consultant: {
        _id,
        ...consultantData,
        projet: consultant.projet.map((projet) => projet.nomProjet),
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Erreur lors de la récupération du consultant" });
  }
});

router.get("/historique-cra/:idConsultant", async (req, res) => {
    try {
      const idConsultant = req.params.idConsultant;
  
      // Rechercher le consultant par son ID
      const consultant = await Consultant.findById(idConsultant);
  
      if (!consultant) {
        return res.status(404).json({ message: "Consultant introuvable" });
      }
  
      // Rechercher les CRA associés au consultant
      const cras = await CRA.find({ consultant: idConsultant });
  
      res.json({ consultant, cras });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Erreur lors de la récupération de l'historique des CRA" });
    }
  });
  

router.get("/statistiques/:consultantId", async (req, res) => {
  try {
    const consultantId = req.params.consultantId;

    // Calcul du nombre de mois travaillés
    const moisTravailles = await CRA.distinct("mois", { consultantId });

    // Calcul du nombre total de jours non travaillés
    const totalJoursNonTravailles = await CRA.aggregate([
      { $match: { consultantId } },
      { $group: { _id: null, total: { $sum: "$nbJoursNonTravailles" } } },
    ]);

    const statistiques = {
      nombreMoisTravailles: moisTravailles.length,
      nombreTotalJoursNonTravailles:
        totalJoursNonTravailles.length > 0
          ? totalJoursNonTravailles[0].total
          : 0,
    };

    res.json(statistiques);
  } catch (error) {
    res
      .status(500)
      .json({
        message:
          "Erreur lors de la récupération des statistiques du consultant",
      });
  }
});

module.exports = router;
