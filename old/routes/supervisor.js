const express = require("express");
const router = Router();
const admin = require("../config/firebaseConfig");
const functions = require("firebase-functions");
const nodemailer = require("nodemailer");
const Supervisor = require("../models/supervisor");
const Consultant = require("../models/consultant");

// Configuration de Nodemailer pour utiliser un service de messagerie (par exemple, Gmail)
const transporter = nodemailer.createTransport({
  service: "outlook",
  auth: {
    user: "hamdi.chebbi@outlook.fr", // Votre adresse e-mail
    pass: "Nassira14", // Votre mot de passe
  },
});

//Liste des supervisors + nbr total
router.get("/supervisors", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Page à afficher, par défaut 1
    const limit = parseInt(req.query.limit) || 10; // Nombre d'éléments par page, par défaut 10

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    // Récupérer la liste des supervisors avec pagination
    const supervisors = await Supervisor.find().skip(startIndex).limit(limit);

    // Comptage total des supervisors
    const totalSupervisors = await Supervisor.countDocuments();

    // Préparer les informations de pagination
    const pagination = {
      currentPage: page,
      totalPages: Math.ceil(totalSupervisors / limit),
      totalItems: totalSupervisors,
    };

    res.json({
      supervisors,
      pagination,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération des supervisors" });
  }
});
// liste des supervisors qui ont expiré la date d'essai
// Créer un supervisor avec un compte
router.post("/create-supervisor", async (req, res) => {
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

    await admin.auth().setCustomUserClaims(userRecord.uid, { role: "supervisor" });

    // Créer un nouvel objet Supervisor avec les données fournies
    const supervisor = new Supervisor({
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

    // Sauvegarder le supervisor dans la base de données MongoDB
    const savedSupervisor = await supervisor.save();

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
      message: "Supervisor créé avec succès",
      supervisor: savedSupervisor,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Erreur lors de la création du supervisor" });
  }
});
exports.api = functions.https.onRequest(router);
// modifier et archiver un supervisor
router.put("/update-supervisor/:id", async (req, res) => {
  try {
    const supervisorId = req.params.id;
    const updatedData = req.body;

    // Recherche et mise à jour du supervisor dans la base de données
    const updatedSupervisor = await Supervisor.findByIdAndUpdate(
      supervisorId,
      updatedData,
      {
        new: true, // Renvoyer le supervisor mis à jour
      }
    );

    if (!updatedSupervisor) {
      return res.status(404).json({ message: "Supervisor non trouvé" });
    }

    res.json({
      message: "Supervisor mis à jour avec succès",
      supervisor: updatedSupervisor,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Erreur lors de la mise à jour du supervisor" });
  }
});

// Afficher un supervisor en détail
router.get("/supervisor/:id", async (req, res) => {
  try {
    const supervisorId = req.params.id;

    // Recherche du supervisor dans la base de données avec les consultants associés
    const supervisor = await Supervisor.findById(supervisorId)
      .populate("consultants")
      .exec();

    if (!supervisor) {
      return res.status(404).json({ message: "Supervisor non trouvé" });
    }

    const detailedSupervisor = {
      nom: supervisor.nom,
      prenom: supervisor.prenom,
      email: supervisor.email,
      // ... Autres informations du supervisor
      consultants: supervisor.consultants.map((consultant) => ({
        nom: consultant.nom,
        prenom: consultant.prenom,
        email: consultant.email,
        // ... Autres informations du consultant
      })),
    };

    res.json({ supervisor: detailedSupervisor });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Erreur lors de la récupération des informations du supervisor",
    });
  }
});

// Endpoint pour afficher le nombre de jours travaillés des consultants d'un supervisor
router.get(
  "/consultants/:supervisorId/nombre-jours-travailles",
  async (req, res) => {
    try {
      const supervisorId = req.params.supervisorId;

      // Recherche du supervisor dans la base de données
      const supervisor = await Supervisor.findById(supervisorId);

      if (!supervisor) {
        return res.status(404).json({ message: "Supervisor non trouvé" });
      }

      // Calcul du nombre total de jours travaillés par tous les consultants du supervisor
      let totalDaysWorked = 0;

      for (const consultantId of supervisor.consultants) {
        const consultant = await Consultant.findById(consultantId);
        if (consultant) {
          totalDaysWorked += consultant.nombreJoursTravailles;
        }
      }

      res.json({
        message: "Nombre de jours travaillés des consultants du supervisor",
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
router.delete("/supervisor/:id", async (req, res) => {
  console.log(req.params.id);
  await Supervisor.deleteOne({ email:'internet.download.supervisor@gmail.com' });
  console.log("done");
  // admin.auth().deleteUser("")
});

module.exports = router;
