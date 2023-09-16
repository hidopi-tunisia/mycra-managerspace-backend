import { Consultant } from "../models";
import { countData, populateData } from "../utils/data-options";
import { ConsultantNotFoundError } from "../utils/errors/consultants";

const getConsultant = async (id, options = {}) => {
  let doc = await Consultant.findById(id);
  let meta = {};
  if (!doc) {
    throw new ConsultantNotFoundError();
  }
  if (options.populate) {
    doc = await populateData(doc, options.populate);
  }
  if (options.count) {
    const count = countData(doc, options.count);
    if (Object.keys(count).length > 0) {
      meta["count"] = count;
    }
  }
  if (Object.keys(meta).length > 0) {
    doc = doc.toObject();
    doc["meta"] = meta;
  }
  return doc;
};

const createConsultant = (payload) => {
  return new Consultant({ ...payload }).save();
};

export { getConsultant, createConsultant };
