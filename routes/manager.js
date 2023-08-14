const express = require("express");
const router = express.Router();
const admin = require("../config/firebaseConfig");
const functions = require("firebase-functions");
const nodemailer = require("nodemailer");
const Manager = require("../models/manager");

// Configuration de Nodemailer pour utiliser un service de messagerie (par exemple, Gmail)
const transporter = nodemailer.createTransport({
    service: "outlook",
    auth: {
      user: "hamdi.chebbi@outlook.fr", // Votre adresse e-mail
      pass: "Nassira14", // Votre mot de passe
    },
  });

//Liste des managers + nbr total
// liste des managers actifs +nbr
// liste des managers qui ont expiré la date d'essai
// Créer un manager avec un compte
router.post("/create-manager", async (req, res) => {
    try {
      const {
        nom,
        prenom,
        email,
        motDePasse,
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
        password: motDePasse,
        displayName: `${prenom} ${nom}`,
      });
  
      // Créer un nouvel objet Manager avec les données fournies
      const manager = new Manager({
        nom,
        prenom,
        email,
        motDePasse,
        uid: userRecord.uid, // Enregistrer l'UID du compte Firebase
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
        text: "Bienvenue sur notre plateforme. Veuillez cliquer sur le lien suivant pour vérifier votre adresse e-mail : " + emailVerificationLink,
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
// Afficher un manager en détail

module.exports = router;
