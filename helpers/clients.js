import { Client } from "../models";
import { ClientNotFoundError } from "../utils/errors/clients";

const getClient = async (id, options = {}) => {
  let doc = await Client.findById(id);
  if (!doc) {
    throw new ClientNotFoundError();
  }
  if (options.join && typeof options.join === "string") {
    if (options.join.split(",").includes("consultants")) {
      doc = await doc.populate({
        path: "consultants",
      });
    }
    if (options.join.split(",").includes("projects")) {
      doc = await doc.populate({
        path: "projects",
      });
    }
  }
  return doc;
};

export { getClient };