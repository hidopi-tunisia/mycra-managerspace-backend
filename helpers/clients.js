import { Client } from "../models";
import { ClientNotFoundError } from "../utils/errors/clients";

const getClient = async (id, options = {}) => {
  let doc = await Client.findById(id);
  let meta = {};
  if (!doc) {
    throw new ClientNotFoundError();
  }
  if (options.join) {
    if (options.join.split(",").includes("projects")) {
      doc = await doc.populate({
        path: "projects",
      });
    }
  }
  if (options.count) {
    meta["count"] = {};
    if (options.count.split(",").includes("projects")) {
      meta["count"]["projects"] = doc.projects.length;
    }
    if(Object.keys(meta["count"]).length === 0){
      delete meta["count"]
    }
    if (Object.keys(meta).length > 0) {
      doc = doc.toObject();
      doc["meta"] = meta;
    }
  }
  return doc;
};

const createClient = (payload) => {
  return new Client({ ...payload }).save();
};

export { getClient, createClient };
