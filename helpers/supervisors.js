import { Client, Supervisor } from "../models";
import { countData, populateData } from "../utils/data-options";
import { SupervisorNotFoundError } from "../utils/errors/supervisors";

const getSupervisor = async (id, options = {}) => {
  let doc = await Supervisor.findById(id);
  let meta = {};
  if (!doc) {
    throw new SupervisorNotFoundError();
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

const createSupervisor = (payload) => {
  return new Supervisor({ ...payload }).save();
};

/**
 * Assigns a supervisor to a client.
 * @function
 * @param {string} supervisorId - The id of the supervisor.
 * @param {string} clientId - The id of the client.
 * @returns {Promise<Project>}
 */
const assignSupervisorToClient = async (supervisorId, clientId) => {
  return Client.findOneAndUpdate(
    { _id: clientId },
    { $set: { supervisor: supervisorId } },
    {
      new: true,
    }
  );
};

export { getSupervisor, createSupervisor, assignSupervisorToClient };
