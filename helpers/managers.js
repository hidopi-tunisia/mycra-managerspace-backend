import { Manager } from "../models";
import { ManagerNotFoundError } from "../utils/errors/managers";

const getManager = async (id, options = {}) => {
  let doc = await Manager.findById(id);
  if (!doc) {
    throw new ManagerNotFoundError();
  }
  if (options.join && typeof options.join === "string") {
    if (options.join.split(",").includes("company")) {
      doc = await doc.populate({
        path: "company",
      });
    }
    if (options.join.split(",").includes("consultants")) {
      doc = await doc.populate({
        path: "consultants",
      });
    }
    if (options.join.split(",").includes("clients")) {
      doc = await doc.populate({
        path: "clients",
      });
    }
  }
  return doc;
};

export { getManager };