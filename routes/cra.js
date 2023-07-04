const express = require("express");
const mongoose = require("mongoose");
const axios = require("axios");
const router = express.Router();
const moment = require("moment");
const CRA = require("../models/cra");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");

router.get("/", function (req, res, next) {
  const currentDate = new Date();
  const firstDayOfMonth = moment().startOf("month").locale("fr");
  const lastDayOfMonth = moment().endOf("month").locale("fr");
  console.log(firstDayOfMonth, lastDayOfMonth);
  //res.json(moment().year());
});

router.post("/postCra", async (req, res, next) => {
  //const currentDate = new Date();

  try {
    let nbJoursTravailles = 0;
    let nbJoursNonTravailles = 0;
    const joursTravailles = [];
    data = req.body;
    data.craType = "mois";
    data.mois = moment().locale("fr").format("MMMM");
    data.annee = moment().format("YYYY");

    // Récupérer les jours fériés de l'année en cours depuis l'API des jours fériés français
    const year = moment().format("YYYY");
    const month = moment().format("MM");
    const url = "https://jours-feries-france.antoine-augusti.fr/api/2023"; // Remplacez l'URL par l'année souhaitée
    const response = await axios.get(url);
    const joursFeries = response.data;

    // Filtrer les jours fériés pour ne garder que ceux du mois en cours
    const joursFeriesDuMois = joursFeries.filter((jourFerie) => {
      const dateJourFerie = moment(jourFerie.date);
      return dateJourFerie.month() === parseInt(month) - 1; // Le mois est basé sur zéro index
    });

    // Afficher le nombre de jours fériés
    const nbJoursFeries = joursFeriesDuMois.length;
    console.log(`Nombre de jours fériés ce mois-ci : ${nbJoursFeries}`);
    data.nbJoursFeries = nbJoursFeries;

    // Ajouter les jours fériés à la liste des jours travaillés du mois en cours.

    joursFeriesDuMois.forEach((jourFerie) => {
      const dateJourFerie = moment(jourFerie.date)
        .startOf("day")
        .format("YYYY-MM-DD");
      const nomJourFerie = jourFerie.nom_jour_ferie;
      // Obtenir le jour de la semaine
      const jourSemaine = moment(dateJourFerie, "DD-MM-YYYY").format("dddd");

      // Obtenir le nom du jour de la semaine en français
      const nomJourSemaine = moment.weekdays(jourSemaine - 1);
      joursTravailles.push({
        jourSemaine: moment(dateJourFerie).locale("fr").format("dddd"),
        date: dateJourFerie,
        travaille: false,
        reason: "Jour férié",
        nomJourFerieDuMois: nomJourFerie,
      });
      data.nomJourFerieDuMois = nomJourFerie;
      console.log("Jours fériés ce mois-ci :", data.nomJourFerieDuMois);
    });
    // Début Calcul du nombre de semaines du mois
    const firstDayOfMonth = moment().startOf("month").locale("fr");
    const lastDayOfMonth = moment().endOf("month").locale("fr");
    const nbSemaines = lastDayOfMonth.diff(firstDayOfMonth, "weeks") + 1;
    data.nbSemaines = nbSemaines;
    // Fin calcul nb semaines
    data.date_debut_du_mois = firstDayOfMonth.format("YYYY-MM-DD");
    data.date_fin_du_mois = lastDayOfMonth.format("YYYY-MM-DD");

    let currentDate = firstDayOfMonth;

    while (currentDate.isSameOrBefore(lastDayOfMonth)) {
      const jourOuvre = {
        jourSemaine: currentDate.locale("fr").format("dddd"),
        date: currentDate.startOf("day").format("YYYY-MM-DD"),
        travaille: currentDate.isoWeekday() <= 5,
      };

      const jourFerie = joursFeriesDuMois.find((jour) =>
        moment(jour.date).isSame(currentDate, "day")
      );
      if (jourFerie) {
        jourOuvre.travaille = false;
        jourOuvre.reason = "Jour férié";
      }

      // Déclaration et initialisation de la variable datesNonTravaillees
      const datesNonTravaillees = req.body.datesNonTravaillees || [];
      // Vérifier si la date actuelle est une date non travaillée
      const dateNonTravaillee = datesNonTravaillees.find((date) =>
        moment(date.date).isSame(currentDate, "day")
      );
      if (dateNonTravaillee) {
        jourOuvre.travaille = false;
        jourOuvre.reason = dateNonTravaillee.raison;

        // Incrémenter le nombre de jours non travaillés
        nbJoursNonTravailles++;
      }

      joursTravailles.push(jourOuvre);
      if (jourOuvre.travaille) {
        nbJoursTravailles++;
      }
      currentDate = currentDate.add(1, "day");
      if (
        !jourOuvre.travaille &&
        jourOuvre.jourSemaine !== "samedi" &&
        jourOuvre.jourSemaine !== "dimanche"
      ) {
        nbJoursNonTravailles++;
      }
    }

    data.joursTravailles = joursTravailles;
    data.nbJoursTravailles = nbJoursTravailles;
    data.nbJoursNonTravailles = nbJoursNonTravailles;

    const cra = new CRA(data);
    savedCRA = await cra.save();
    console.log(
      data.nbJoursTravailles,
      "jours travaille pour le",
      data.craType,
      "de",
      data.mois,
      "en",
      data.annee
    );
    console.log(data.nbJoursNonTravailles, ": jours Non travaillées");
    res.send(savedCRA);
  } catch (error) {
    res.status(400).json({ message: "Erreur" });
    console.log(error);
  }
});

router.put("/saisirIndisponibilite/:id", async (req, res, next) => {
  const id = req.params.id;
  const { dateDebut, dateFin, raison } = req.body;

  try {
    const cra = await CRA.findById(id);

    // Vérifier si le CRA existe
    if (!cra) {
      return res.status(404).json({ message: "CRA introuvable" });
    }


    // Ajouter la période d'indisponibilité au tableau des indisponibilités
    cra.indisponibilites.push({ dateDebut, dateFin, raison });

    // Mettre à jour les jours travaillés correspondants dans le tableau
    const joursTravailles = cra.joursTravailles;
    const joursIndisponibles = moment(dateFin).diff(dateDebut, "days") + 1;

    joursTravailles.forEach((jour) => {
      const dateJour = moment(jour.date);

      if (dateJour.isBetween(dateDebut, dateFin, null, "[]")) {
        jour.travaille = false;
        jour.reason = raison;
      }
    });

    // Mettre à jour le nombre de jours non travaillés
    cra.nbJoursNonTravailles += joursIndisponibles;

    // Mettre à jour le nombre de jours travaillés
    cra.nbJoursTravailles -= joursIndisponibles;

    // Sauvegarder les modifications du CRA
    await cra.save();

    res.json({ message: "Période d'indisponibilité ajoutée avec succès" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Erreur lors de la mise à jour du CRA" });
  }
});

// endpoint : Confirmer un CRA PATCH et/ou Refuser Un CRA avec une raison + date
router.put("/refuser-cra/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const { raison } = req.body;
    const currentDate = new Date();

    const cra = await CRA.findById(id);

    // Vérifier si le CRA existe
    if (!cra) {
      return res.status(404).json({ message: "CRA introuvable" });
    }

    // Mettre à jour les détails de refus
    cra.confirmation_refus.date_refus = currentDate;
    cra.confirmation_refus.refused_by_manager = true;
    cra.confirmation_refus.raison_refus = raison;
    cra.status = "Refusee";

    // Réinitialiser confirmed_by_manager à false si déjà true
    if (cra.confirmation_refus.confirmed_by_manager) {
      cra.confirmation_refus.confirmed_by_manager = false;
    }

    // Sauvegarder les modifications du CRA
    await cra.save();

    res.json({ message: "CRA refusé avec succès" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Erreur lors du refus du CRA" });
  }
});

// endpoint : Supprimer un CRA (is_deleted: true / deleted_date : Date.now())
// le pourcentage des CRA saisi du mois en cours par le nombre total des consultants

router.put("/update-cra/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const newData = req.body;
    const updated = await CRA.findByIdAndUpdate({ _id: id }, newData);
    if (!updated) {
      return res.status(404).json({ message: "CRA introuvable" });
    }
    res.json({ message: "CRA mis à jour avec succès" });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la mise à jour du CRA" });
  }
});

router.get("/getall-cra", async (req, res) => {
  try {
    cras = await CRA.find();
    res.send(cras);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des CRA" });
  }
});

router.get("/get_cra_by_id/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const cra = await CRA.findById(id);
    if (!cra) {
      return res.status(404).json({ message: "CRA introuvable" });
    }
    res.json(cra);
    console.log("Nb jours travaillés : ", cra.nbJoursTravailles);
    console.log("Nb jours non travaillés : ", cra.nbJoursNonTravailles);
    console.log("Nb jours fériés : ", cra.nbJoursFeries);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Erreur lors de la récupération du CRA" });
  }
});

// router.delete("/delete/:id", (req, res) => {
//   id = req.params.id;
//   CRA.findByIdAndDelete({ _id: id })
//     .then((deleteCRA) => {
//       res.send(deleteCRA);
//     })
//     .catch((err) => {
//       res.send(err);
//     });
// });

module.exports = router;
