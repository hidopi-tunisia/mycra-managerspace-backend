import { CRA } from "../models";
import { CRANotFoundError } from "../utils/errors/cras";

const getCRA = async (id, options = {}) => {
  let doc = await CRA.findById(id);
  if (!doc) {
    throw new CRANotFoundError();
  }
  if (options.populate) {
    if (options.join.split(",").includes("consultant")) {
      doc = await doc.populate({
        path: "consultant",
      });
    }
    if (options.populate.split(",").includes("project")) {
      doc = await doc.populate({
        path: "project",
      });
    }
  }
  return doc;
};

const createCRA = async (payload) => {
  return new CRA({ ...payload }).save();
};
export { getCRA, createCRA };
