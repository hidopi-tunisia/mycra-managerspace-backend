import fs from "fs";
const LOGO = fs.readFileSync("helpers/export/pdf/cra/logo.jpg").toString("base64");
const Colors = {
  working: "#2196f3",
  remote: "#9C27B0",
  half: "#2196f3",
  off: "#F44336",
  holidays: "#4CAF50",
  weekends: "#4CAF50",
};
const Reasons = {
  "Paid leave": "CP",
  Absence: "Absence",
  "Sick leave": "Congé maladie",
  "Authorized unpaid leave": "Congé autorisé non rémunéré",
  "Unauthorized unpaid leave": "Congé non autorisé non rémunéré",
  Moving: "Déménagement",
  "Prenatal medical examination": "Examen médical prénatal",
  "Child's marriage": "Mariage de l'enfant",
  "Marriage-PACS": "Mariage-PACS",
  Maternity: "Maternité",
  Birth: "Naissance",
  Paternity: "Paternité",
  Childcare: "Garde d'enfants",
  "Work-related accident-commute": "Accident de travail-trajet",
  Other: "Autre",
};
const APP_URL = "https://mycra-dev.web.app";
const TEMP_PATH="tmp/files/pdfs/"
export { APP_URL, LOGO, Colors, Reasons,TEMP_PATH };
