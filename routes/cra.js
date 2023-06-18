const express = require("express");

const router = express.Router();
const moment = require("moment");
require('moment/locale/fr'); // le jour de la semaine et le mois en FR
const CRA = require("../models/cra");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");

router.get("/", function (req, res, next) {
  const currentDate = new Date();
  res.json(moment().year());
});

router.post("/postCra", async (req, res, next) => {
  
  const currentDate = new Date();
  try {
    let nbJoursTravailles = 0;
    const joursTravailles = [];
    data = req.body;
    data.craType = "mois";
    data.mois = moment().format("MMMM");
    data.annee = moment().year();
   // data.joursTravailles = joursOuvres;

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
     // if (currentDate.day() !== 0 && currentDate.day() !== 6) { // Vérification si le jour est un jour de semaine (excluant les weekends)

      const jourOuvre = {
        jourSemaine: currentDate.format("dddd"), // Sauvegarder le jour de la semaine
        date: currentDate.toDate(),
        travaille: true, // Modifier cette valeur en fonction des jours travaillés
      };

      joursTravailles.push(jourOuvre);
      if (jourOuvre.travaille) {
        nbJoursTravailles++;
      }

      currentDate = currentDate.add(1, 'day');
    }
  //}
    data.joursTravailles = joursTravailles;
    data.nbJoursTravailles = nbJoursTravailles;




    var cra = new CRA(data);
    savedCRA = await cra.save();
    console.log(data.nbJoursTravailles, "jours travaille", data.craType);
    res.send(savedCRA);
  } catch (error) {
    res.status(400).json({ message: "Erreur" });
    console.log(error);
  }
});
router.post("/post-my-cra-by-week", async (req, res) => {
  try {
    data = req.body;
    data.type = "week";
    cra = new CRA(data);
    savedCRA = await cra.save();

    res.send(savedCRA);
  } catch (error) {
    res.send(error);
  }
});
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
