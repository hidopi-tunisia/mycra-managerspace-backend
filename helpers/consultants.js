import { Consultant } from "../models";
import { ConsultantNotFoundError } from "../utils/errors/consultants";

const getConsultant = async (id, options = {}) => {
  let doc = await Consultant.findById(id);
  if (!doc) {
    throw new ConsultantNotFoundError();
  }
  if (options.populate) {
    if (options.populate.split(",").includes("projects")) {
      doc = await doc.populate({
        path: "projects",
      });
    }
    if (options.populate.split(",").includes("clients")) {
      doc = await doc.populate({
        path: "client",
      });
    }
  }
  return doc;
};

const createConsultant = (payload) => {
  return new Consultant({ ...payload }).save();
};

export { getConsultant, createConsultant };
