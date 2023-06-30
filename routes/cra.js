const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const moment = require("moment");
require("moment/locale/fr"); // le jour de la semaine et le mois en FR
const CRA = require("../models/cra");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");

router.get("/", function (req, res, next) {
  const currentDate = new Date();
  const firstDayOfMonth = moment().startOf("month");
  const lastDayOfMonth = moment().endOf("month");
  console.log(firstDayOfMonth, lastDayOfMonth);
  //res.json(moment().year());
});

router.post("/postCra", async (req, res, next) => {
  //const currentDate = new Date();
  try {
    const holidays = [
      /* Liste des dates de jours fériés */
    ];
    let nbJoursTravailles = 0;
    let nbJoursNonTravailles = 0;
    const joursTravailles = [];
    data = req.body;
    data.craType = "mois";
    data.mois = moment().format("MMMM");
    data.annee = moment().format("YYYY");

    // Début Calcul du nombre de semaines du mois
    const firstDayOfMonth = moment().startOf("month");
    const lastDayOfMonth = moment().endOf("month");
    const nbSemaines = lastDayOfMonth.diff(firstDayOfMonth, "weeks") + 1;
    data.nbSemaines = nbSemaines;
    // Fin calcul nb semaines

    data.date_debut_du_mois = firstDayOfMonth;
    data.date_fin_du_mois = lastDayOfMonth;

    let currentDate = firstDayOfMonth;

    while (currentDate.isSameOrBefore(lastDayOfMonth)) {
      const jourOuvre = {
        jourSemaine: currentDate.format("dddd"), // Sauvegarder le jour de la semaine
        date: currentDate.toDate(), // Date correspondante
        travaille: currentDate.isoWeekday() <= 5
      };

      // Vérifier si la date est un jour non travaillé spécifié dans la requête
      const jourNonTravaille = data.joursTravailles.find(jour => moment(jour.date).isSame(currentDate, "day"));
      if (jourNonTravaille && !jourNonTravaille.travaille) {
        jourOuvre.travaille = false; // Marquer la date comme non travaillée
        jourOuvre.reason = jourNonTravaille.reason; // Récupérer la raison spécifiée
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

router.post("/calculerNbJoursTravailles", async (req, res, next) => {
  try {
    const { date_debut_du_mois, date_fin_du_mois } = req.body;
    let nbJoursTravailles = 0;
    const joursTravailles = [];

    let currentDate = moment(date_debut_du_mois).startOf("day");

    while (currentDate.isSameOrBefore(date_fin_du_mois)) {
      const jourOuvre = {
        jourSemaine: currentDate.format("dddd"),
        date: currentDate.toDate(),
        travaille: currentDate.isoWeekday() <= 5,
      };

      joursTravailles.push(jourOuvre);
      if (jourOuvre.travaille) {
        nbJoursTravailles++;
      }

      currentDate = currentDate.add(1, "day");
    }

    const data = {
      joursTravailles,
      nbJoursTravailles,
      date_debut_du_mois,
      date_fin_du_mois,
    };
    const dateDebut = moment(data.date_debut_du_mois);
    const mois = dateDebut.format("MMMM");

    data.craType = "entre 2 dates";
    data.mois = mois;
    data.annee = moment().format("YYYY");
    var cra = new CRA(data);
    const savedCRA = await cra.save();
    console.log(
      data.nbJoursTravailles,
      "jours travailles pour le",
      cra.craType,
      "de",
      cra.mois,
      "en",
      data.annee
    );
    console.log(
      "période : ",
      cra.date_debut_du_mois,
      "au",
      cra.date_fin_du_mois
    );
    res.send(savedCRA);
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .json({ message: "Erreur lors du calcul des jours travaillés." });
  }
});

router.post("/saisirIndisponibilite", async (req, res, next) => {
  try {
    const { dateDebut, dateFin, reason } = req.body;

    // Vérification si la raison est fournie
    if (!reason) {
      return res
        .status(400)
        .json({ message: "Il faut saisir une raison d'absence" });
    }

    // Convertir les dates en format ISO 8601
    const startDate = new Date(dateDebut).toISOString();
    const endDate = new Date(dateFin).toISOString();

    // Recherche du CRA correspondant
    const cra = await CRA.findOne({ consultant: req.user.id });

    // Vérification si le CRA existe
    if (!cra) {
      return res
        .status(404)
        .json({ message: "Aucun CRA trouvé pour ce consultant" });
    }

    // Mise à jour des absences
    const joursTravailles = cra.joursTravailles.map((jour) => {
      if (jour.date >= startDate && jour.date <= endDate) {
        jour.travaille = false;
        jour.reason = reason;
      }
      return jour;
    });

    // Mise à jour du CRA avec les nouvelles absences
    cra.joursTravailles = joursTravailles;
    await cra.save();

    return res.json(cra);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message:
        "Une erreur s'est produite lors de la saisie de l'indisponibilité",
    });
  }
});

// Fonction pour obtenir le nom du jour de la semaine en français
function getNomJourSemaine(jourSemaine) {
  const joursSemaine = [
    "Dimanche",
    "Lundi",
    "Mardi",
    "Mercredi",
    "Jeudi",
    "Vendredi",
    "Samedi",
  ];
  return joursSemaine[jourSemaine];
}

router.put("/update/:id", async (req, res) => {
  try {
    id = req.params.id;
    newData = req.body;
    updated = await CRA.findByIdAndUpdate({ _id: id }, newData);
    res.send(updated);
  } catch (error) {
    res.send(err);
  }
});
router.get("/getall", async (req, res) => {
  try {
    cras = await CRA.find();
    res.send(cras);
  } catch (error) {
    res.send(error);
  }
});
router.get("/getbyid/:id", async (req, res) => {
  try {
    id = req.params.id;
    cra = await CRA.findById({ _id: id });
    res.send(cra);
  } catch (error) {
    res.send(error);
  }
});
router.delete("/delete/:id", (req, res) => {
  id = req.params.id;
  CRA.findByIdAndDelete({ _id: id })
    .then((deleteCRA) => {
      res.send(deleteCRA);
    })
    .catch((err) => {
      res.send(err);
    });
});

module.exports = router;
