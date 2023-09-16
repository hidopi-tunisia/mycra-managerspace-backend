import { Client, Manager } from "../models";
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

/**
 * Assigns a manager to a client.
 * @function
 * @param {string} managerId - The id of the manager.
 * @param {string} clientId - The id of the client.
 * @returns {Promise<Project>}
 */
const assignManagerToClient = async (managerId, clientId) => {
  return Client.findOneAndUpdate(
    { _id: clientId },
    { $set: { manager: managerId } },
    {
      new: true,
    }
  );
};

export { getManager, createManager, assignManagerToClient };
