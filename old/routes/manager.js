const express = require("express");
const router = express.Router();
const admin = require("../config/firebaseConfig");
const functions = require("firebase-functions");
const nodemailer = require("nodemailer");
const Manager = require("../models/manager");
const Consultant = require("../models/consultant");

// Configuration de Nodemailer pour utiliser un service de messagerie (par exemple, Gmail)
const transporter = nodemailer.createTransport({
  service: "outlook",
  auth: {
    user: "hamdi.chebbi@outlook.fr", // Votre adresse e-mail
    pass: "Nassira14", // Votre mot de passe
  },
});

//Liste des managers + nbr total
router.get("/managers", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Page à afficher, par défaut 1
    const limit = parseInt(req.query.limit) || 10; // Nombre d'éléments par page, par défaut 10

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    // Récupérer la liste des managers avec pagination
    const managers = await Manager.find().skip(startIndex).limit(limit);

    // Comptage total des managers
    const totalManagers = await Manager.countDocuments();

    // Préparer les informations de pagination
    const pagination = {
      currentPage: page,
      totalPages: Math.ceil(totalManagers / limit),
      totalItems: totalManagers,
    };

    res.json({
      managers,
      pagination,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération des managers" });
  }
});
// liste des managers qui ont expiré la date d'essai
// Créer un manager avec un compte
router.post("/create-manager", async (req, res) => {
  try {
    const {
      nom,
      prenom,
      email,
      entreprise,
      periodeDessai,
      offre,
      aAccepteCGU,
      cguVersionAcceptee,
      statutCompte,
    } = req.body;

    // Créer le compte Firebase avec l'adresse e-mail et le mot de passe
    const userRecord = await admin.auth().createUser({
      email,
      displayName: `${prenom} ${nom}`,
    });

    await admin.auth().setCustomUserClaims(userRecord.uid, { role: "manager" });

    // Créer un nouvel objet Manager avec les données fournies
    const manager = new Manager({
      _id: userRecord.uid, // Enregistrer l'UID du compte Firebase
      nom,
      prenom,
      email,
      entreprise,
      periodeDessai,
      offre,
      aAccepteCGU,
      cguVersionAcceptee,
      statutCompte,
    });

    // Sauvegarder le manager dans la base de données MongoDB
    const savedManager = await manager.save();

    // Envoyer l'e-mail de bienvenue via Nodemailer et les modèles d'e-mails Firebase
    const emailVerificationLink = await admin
      .auth()
      .generateEmailVerificationLink(email);

    const mailOptions = {
      from: "hamdi.chebbi@outlook.fr", // Votre adresse e-mail
      to: email,
      subject: "Bienvenue sur notre plateforme",
      text:
        "Bienvenue sur notre plateforme. Veuillez cliquer sur le lien suivant pour vérifier votre adresse e-mail : " +
        emailVerificationLink,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log("E-mail envoyé : " + info.response);
      }
    });

    res.json({
      message: "Manager créé avec succès",
      manager: savedManager,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Erreur lors de la création du manager" });
  }
});
exports.api = functions.https.onRequest(router);
// modifier et archiver un manager
router.put("/update-manager/:id", async (req, res) => {
  try {
    const managerId = req.params.id;
    const updatedData = req.body;

    // Recherche et mise à jour du manager dans la base de données
    const updatedManager = await Manager.findByIdAndUpdate(
      managerId,
      updatedData,
      {
        new: true, // Renvoyer le manager mis à jour
      }
    );

    if (!updatedManager) {
      return res.status(404).json({ message: "Manager non trouvé" });
    }

    res.json({
      message: "Manager mis à jour avec succès",
      manager: updatedManager,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Erreur lors de la mise à jour du manager" });
  }
});

// Afficher un manager en détail
router.get("/manager/:id", async (req, res) => {
  try {
    const managerId = req.params.id;

    // Recherche du manager dans la base de données avec les consultants associés
    const manager = await Manager.findById(managerId)
      .populate("consultants")
      .exec();

    if (!manager) {
      return res.status(404).json({ message: "Manager non trouvé" });
    }

    const detailedManager = {
      nom: manager.nom,
      prenom: manager.prenom,
      email: manager.email,
      // ... Autres informations du manager
      consultants: manager.consultants.map((consultant) => ({
        nom: consultant.nom,
        prenom: consultant.prenom,
        email: consultant.email,
        // ... Autres informations du consultant
      })),
    };

    res.json({ manager: detailedManager });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Erreur lors de la récupération des informations du manager",
    });
  }
});

// Endpoint pour afficher le nombre de jours travaillés des consultants d'un manager
router.get(
  "/consultants/:managerId/nombre-jours-travailles",
  async (req, res) => {
    try {
      const managerId = req.params.managerId;

      // Recherche du manager dans la base de données
      const manager = await Manager.findById(managerId);

      if (!manager) {
        return res.status(404).json({ message: "Manager non trouvé" });
      }

      // Calcul du nombre total de jours travaillés par tous les consultants du manager
      let totalDaysWorked = 0;

      for (const consultantId of manager.consultants) {
        const consultant = await Consultant.findById(consultantId);
        if (consultant) {
          totalDaysWorked += consultant.nombreJoursTravailles;
        }
      }

      res.json({
        message: "Nombre de jours travaillés des consultants du manager",
        totalDaysWorked,
      });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ message: "Erreur lors de la récupération des données" });
    }
  }
);
router.delete("/manager/:id", async (req, res) => {
  console.log(req.params.id);
  await Manager.deleteOne({ email:'internet.download.manager@gmail.com' });
  console.log("done");
  // admin.auth().deleteUser("")
});

module.exports = router;
