import QRCode from "qrcode";
import moment from "moment";
import { APP_URL, LOGO, Reasons, Colors } from "./constants.js";

const drawHeader = (doc, cra) => {
  doc.addImage(LOGO, "JPEG", 273, 0, 10, 10);
  const month = moment(`${cra.date.year}/${cra.date.month + 1}`);
  let content = `CRA du ${month.format("MMMM")} ${cra.date.year}`;
  const { consultant } = cra;
  if (consultant && consultant.firstName && consultant.lastName) {
    content = `${content} - ${consultant.firstName} ${consultant.lastName}`;
  }
  doc.text(content, 14, 8);
  doc.setFontSize(9);
  doc.text("1", 282, 200);
};
const prepareData = (cra) => {
  let data = [];
  data = [
    ...data,
    ...cra.working.map(({ date }) => ({ date, type: "working" })),
  ];
  data = [...data, ...cra.half.map(({ date }) => ({ date, type: "half" }))];
  data = [...data, ...cra.remote.map(({ date }) => ({ date, type: "remote" }))];
  data = [
    ...data,
    ...cra.off.map(({ date, meta }) => ({ date, type: "off", meta })),
  ];
  data = [
    ...data,
    ...cra.holidays.map(({ date }) => ({ date, type: "holidays" })),
  ];
  data = [
    ...data,
    ...cra.weekends.map(({ date }) => ({ date, type: "weekends" })),
  ];
  return data;
};

const sortData = (data) => {
  const sorted = data.sort((a, b) => new Date(a.date) - new Date(b.date));
  let body = [];
  const totals = {
    working: 0,
    remote: 0,
    half: 0,
    off: 0,
    holidays: 0,
    weekends: 0,
    total: 0,
  };
  sorted.forEach((element) => {
    const arr = [];
    arr.push({
      content: `${element.date.substr(8)} - ${moment(element.date).format(
        "dddd"
      )}`,
      rowSpan: 1,
      styles:
        element.type === "weekends"
          ? {
              fontStyle: "bold",
              textColor: Colors[element.type],
              lineColor: Colors[element.type],
            }
          : {},
    });
    arr.push({
      content: element.type === "working" ? "Oui" : "",
      rowSpan: 1,
      styles:
        element.type === "working"
          ? {
              halign: "center",
              textColor: "#ffffff",
              fillColor: Colors[element.type],
            }
          : {},
    });
    arr.push({
      content: element.type === "remote" ? "Oui" : "",
      rowSpan: 1,
      styles:
        element.type === "remote"
          ? {
              halign: "center",
              textColor: "#ffffff",
              fillColor: Colors[element.type],
            }
          : {},
    });
    arr.push({
      content: element.type === "half" ? "Oui" : "",
      rowSpan: 1,
      styles:
        element.type === "half"
          ? {
              halign: "center",
              fontStyle: "bold",
              fillColor: "#ffffff",
              textColor: Colors[element.type],
              lineColor: Colors[element.type],
              lineWidth: 0.2,
            }
          : {},
    });
    arr.push({
      content: element.type === "off" ? Reasons[element.meta.value] : "",
      rowSpan: 1,
      styles:
        element.type === "off"
          ? {
              textColor: "#ffffff",
              fillColor: Colors[element.type],
              halign: "center",
            }
          : {},
    });
    arr.push({
      content: element.type === "holidays" ? "Oui" : "",
      rowSpan: 1,
      styles:
        element.type === "holidays"
          ? {
              textColor: "#ffffff",
              fillColor: Colors[element.type],
              halign: "center",
            }
          : {},
    });
    let total = 0;
    if (element.type === "working" || element.type === "remote") {
      total = 1;
    } else if (element.type === "half") {
      total = 0.5;
    }
    arr.push({
      content: total,
      rowSpan: 1,
      styles: {
        halign: "center",
        fontStyle: "bold",
      },
    });
    totals[element.type] += 1;
    totals["total"] += total;
    body.push(arr);
  });
  return { body, totals };
};
const prepareTable = (doc, body, totals) => {
  doc.autoTable({
    head: [
      [
        {
          content: "Journées",
          rowSpan: 1,
          styles: {},
        },
        {
          content: "Travaillés",
          rowSpan: 1,
          styles: {
            halign: "center",
          },
        },
        {
          content: "Télétravail",
          rowSpan: 1,
          styles: {
            halign: "center",
          },
        },
        {
          content: "Demi-journées",
          rowSpan: 1,
          styles: {
            halign: "center",
          },
        },
        {
          content: "Absences",
          rowSpan: 1,
          styles: {
            halign: "center",
          },
        },
        {
          content: "Jours fériés",
          rowSpan: 1,
          styles: {
            halign: "center",
          },
        },
        {
          content: "Total",
          rowSpan: 1,
          styles: {
            halign: "center",
          },
        },
        {
          content: "Commentaires",
          rowSpan: 1,
          styles: {
            halign: "center",
          },
        },
      ],
    ],
    body,
    foot: [
      [
        "Total",
        {
          // Working
          content: totals["working"],
          rowSpan: 1,
          styles: { halign: "center" },
        },
        {
          // Remote
          content: totals["remote"],
          rowSpan: 1,
          styles: { halign: "center" },
        },
        {
          // Half-day
          content: totals["half"],
          rowSpan: 1,
          styles: { halign: "center" },
        },
        {
          // Off
          content: totals["off"],
          rowSpan: 1,
          styles: { halign: "center" },
        },
        {
          // Holidays
          content: totals["holidays"],
          rowSpan: 1,
          styles: { halign: "center" },
        },
        {
          // Total
          content: totals["total"],
          rowSpan: 1,
          styles: { halign: "center" },
        },
      ],
    ],
  });
};
const prepareQRCode = async (doc, str) => {
  const qrcode = await QRCode.toDataURL(`${APP_URL}/#/consultants/${str}`, {
    color: {
      dark: "#2980b9",
      light: "#FFFFFF",
    },
  });
  doc.addImage(qrcode, "PNG", 15, doc.lastAutoTable.finalY + 40, 40, 40);
};
const drawFooter = (doc, cra) => {
  const month = moment(`${cra.date.year}/${cra.date.month + 1}`);
  doc.setDrawColor(41, 128, 185);
  doc.rect(14, doc.lastAutoTable.finalY + 16, 269, 72, "S");
  doc.addImage(LOGO, "JPEG", 18, doc.lastAutoTable.finalY + 20, 10, 10);
  doc.setFontSize(12);
  doc.text(
    `CRA du ${month.format("MMMM")} ${cra.date.year}`,
    32,
    doc.lastAutoTable.finalY + 27
  );
  const { consultant } = cra;
  doc.setFontSize(18);
  if (consultant && consultant.firstName && consultant.lastName) {
    doc.text(
      `${consultant.firstName} ${consultant.lastName}`,
      18,
      doc.lastAutoTable.finalY + 38
    );
  }
  doc.setFontSize(9);
  doc.text(`Signature du consultant`, 130, doc.lastAutoTable.finalY + 24);
  doc.text(`Signature du client`, 230, doc.lastAutoTable.finalY + 24);
  doc.setFontSize(9);
  doc.text("2", 282, 200);
};
export {
  drawHeader,
  prepareData,
  sortData,
  prepareTable,
  prepareQRCode,
  drawFooter,
};
