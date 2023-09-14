import { CRA } from "../models";
import { CRANotFoundError } from "../utils/errors/cras";

const getCRA = async (id, options = {}) => {
  let doc = await CRA.findById(id);
  if (!doc) {
    throw new CRANotFoundError();
  }
  if (options.join) {
    if (options.join.split(",").includes("consultant")) {
      doc = await doc.populate({
        path: "consultant",
      });
    }
    if (options.join.split(",").includes("project")) {
      doc = await doc.populate({
        path: "project",
      });
    }
  }
  return doc;
};

export { getCRA };
