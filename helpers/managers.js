import { Manager } from "../models";
import { ManagerNotFoundError } from "../utils/errors/managers";

const getManager = async (id, options = {}) => {
  let doc = await Manager.findById(id);
  if (!doc) {
    throw new ManagerNotFoundError();
  }
  if (options.populate) {
    if (options.populate.split(",").includes("company")) {
      doc = await doc.populate({
        path: "company",
      });
    }
    if (options.populate.split(",").includes("consultants")) {
      doc = await doc.populate({
        path: "consultants",
      });
    }
    if (options.populate.split(",").includes("clients")) {
      doc = await doc.populate({
        path: "clients",
      });
    }
  }
  return doc;
};

const createManager = (payload) => {
  return new Manager({ ...payload }).save();
};

export { getManager, createManager };
