import { Client } from "../models";
import { ClientNotFoundError } from "../utils/errors/clients";

const getClient = async (id, options = {}) => {
  let doc = await Client.findById(id);
  let meta = {};
  if (!doc) {
    throw new ClientNotFoundError();
  }
  if (options.populate) {
    let populate = options.populate.split(",").map((path) => path);
    doc = await doc.populate(populate);
  }
  if (options.count) {
    meta["count"] = {};
    options.count.split(",").forEach((path) => {
      meta["count"][path] = doc[path].length;
    });
    if (Object.keys(meta["count"]).length === 0) {
      delete meta["count"];
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
