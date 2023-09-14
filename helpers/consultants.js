import { Consultant } from "../models";
import { ConsultantNotFoundError } from "../utils/errors/consultants";

const getConsultant = async (id, options = {}) => {
  let doc = await Consultant.findById(id);
  if (!doc) {
    throw new ConsultantNotFoundError();
  }
  if (options.join && typeof options.join === "string") {
    if (options.join.split(",").includes("projects")) {
      doc = await doc.populate({
        path: "projet",
      });
    }
    if (options.join.split(",").includes("clients")) {
      doc = await doc.populate({
        path: "client",
      });
    }
  }
  return doc;
};

export { getConsultant };