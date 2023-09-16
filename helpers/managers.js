import { Manager } from "../models";
import { countData, populateData } from "../utils/data-options";
import { ManagerNotFoundError } from "../utils/errors/managers";

const getManager = async (id, options = {}) => {
  let doc = await Manager.findById(id);
  if (!doc) {
    throw new ManagerNotFoundError();
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

const createManager = (payload) => {
  return new Manager({ ...payload }).save();
};

export { getManager, createManager };
