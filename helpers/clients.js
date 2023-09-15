import { Client } from "../models";
import { countData, populateData } from "../utils/data-options";
import { ClientNotFoundError } from "../utils/errors/clients";

// TODO: Use this
const getClient = async (id, options = {}) => {
  let doc = await Client.findById(id);
  let meta = {};
  if (!doc) {
    throw new ClientNotFoundError();
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

const createClient = (payload) => {
  return new Client({ ...payload }).save();
};

export { getClient, createClient };
