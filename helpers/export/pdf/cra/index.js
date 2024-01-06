import fs from 'fs'
import moment from "moment";
import { jsPDF } from "jspdf";
import { applyPlugin } from "jspdf-autotable";
import {
  drawFooter,
  drawHeader,
  prepareData,
  prepareQRCode,
  prepareTable,
  sortData,
} from "./helpers.js";
import { TEMP_PATH } from './constants.js';

moment.locale("fr");
applyPlugin(jsPDF);

const exportPDF = async (cra) => {
  const doc = new jsPDF({ orientation: "landscape" });
  drawHeader(doc, cra);
  const data = prepareData(cra);
  const { body, totals } = sortData(data);
  prepareTable(doc, body, totals);
  drawFooter(doc, cra);
  await prepareQRCode(doc, cra.consultant._id);
  fs.mkdirSync(TEMP_PATH, { recursive: true });
  const filename = `${TEMP_PATH}/cra-${new Date()
    .toISOString()
    .substring(0, 10)}.pdf`;
  doc.save(filename);
  return filename;
};

export { exportPDF };
