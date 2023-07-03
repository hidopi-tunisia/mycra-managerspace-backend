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

// Fonction pour vérifier si une date est un jour férié
function isHoliday(date, holidays) {
  const formattedDate = moment(date).format("YYYY-MM-DD");
  return holidays.some((holiday) => holiday.date === formattedDate);
}

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
// endpoint : Confirmer un CRA PATCH et/ou Refuser Un CRA avec une raison
// endpoint : Supprimer un CRA (is_deleted: true / deleted_date : Date.now())

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
