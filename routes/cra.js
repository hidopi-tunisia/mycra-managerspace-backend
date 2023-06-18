const express = require("express");

const router = express.Router();
const moment = require("moment");
const CRA = require("../models/cra");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");

router.get("/", function (req, res, next) {
  const currentDate = new Date();
  res.json(moment().format("MMMM"));
});

router.post("/postCra", async (req, res, next) => {
  const joursOuvres = [
    { jour: "Lundi", travaille: true },
    { jour: "Mardi", travaille: true },
    { jour: "Mercredi", travaille: true },
    { jour: "Jeudi", travaille: true },
    { jour: "Vendredi", travaille: true },
  ];
  const currentDate = new Date();
  try {
    data = req.body;
    data.craType = "mois";
    data.mois = moment().format("MMMM");
    data.annee = currentDate.getFullYear();
    data.joursTravailles = joursOuvres;

    // Calcul du nombre de semaines dans le mois
    const firstDayOfMonth = moment().startOf("month");
    const lastDayOfMonth = moment().endOf("month");
    const nbSemaines = lastDayOfMonth.diff(firstDayOfMonth, "weeks") + 1;
    data.nbSemaines = nbSemaines;
    data.date_debut_du_mois = firstDayOfMonth;
    data.date_fin_du_mois = lastDayOfMonth;

    // Calcul du nombre de jours travaillés
    const nbJoursTravailles = joursOuvres.filter(
      (jour) => jour.travaille
    ).length;
    data.nbJoursTravailles = nbJoursTravailles;

    var cra = new CRA(data);
    savedCRA = await cra.save();
    console.log(data.nbJoursTravailles, "jours travaille", data.craType);
    res.send(savedCRA);
  } catch (error) {
    res.status(400).json({ message: "Erreur" }, error);
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
