import { Client } from "../models";
import { ClientNotFoundError } from "../utils/errors/clients";

const getClient = async (id, options = {}) => {
  let doc = await Client.findById(id);
  if (!doc) {
    throw new ClientNotFoundError();
  }
  if (options.join) {
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

const createClient = (payload) => {
  return new Client({ ...payload }).save();
};

export { getClient, createClient };
