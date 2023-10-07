import { Client } from "../models/index.js";
import { countData, populateData } from "../utils/data-options/index.js";
import { ClientNotFoundError } from "../utils/errors/clients.js";

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

const getClients = async ({
  page,
  limit,
  sort,
  supervisor,
  status,
  siret,
  representative,
  companyName,
  street,
  city,
  zipCode,
  createdAtMin,
  createdAtMax,
  populate,
} = {}) => {
  const predicate = {};
  if (supervisor) {
    predicate["supervisor"] = supervisor;
  }
  if (status) {
    predicate["status"] = status;
  }
  if (companyName) {
    predicate["company.name"] = { $regex: companyName, $options: "i" };
  }
  if (representative) {
    predicate["company.representative"] = { $regex: representative, $options: "i" };
  }
  if (siret) {
    predicate["company.siret"] = siret;
  }
  if (zipCode) {
    predicate["company.address.zipCode"] = zipCode;
  }
  if (city) {
    predicate["company.address.city"] = { $regex: city, $options: "i" };
  }
  if (street) {
    predicate["company.address.street"] = { $regex: street, $options: "i" };
  }
  if (createdAtMin || createdAtMax) {
    if (createdAtMin && !createdAtMax) {
      predicate["createdAt"] = {
        $gte: new Date(createdAtMin),
      };
    } else if (!createdAtMin && createdAtMax) {
      predicate["createdAt"] = {
        $lt: new Date(createdAtMax),
      };
    } else {
      predicate["createdAt"] = {
        $gte: new Date(createdAtMin),
        $lt: new Date(createdAtMax),
      };
    }
  }
  let docs;
  if (populate) {
    docs = await Client.find(predicate)
      .skip(page * limit)
      .limit(limit)
      .sort({ createdAt: sort === "asc" ? 1 : -1 })
      .populate(populate.split(",").map((path) => path));
  } else {
    docs = await Client.find(predicate)
      .skip(page * limit)
      .limit(limit)
      .sort({ createdAt: sort === "asc" ? 1 : -1 });
  }
  return docs;
};

const createClient = (payload) => {
  return new Client({ ...payload }).save();
};

const updateClient = async (id, payload) => {
  return Client.findByIdAndUpdate(id, { ...payload }, { new: true });
};

const deleteClient = async (id) => {
  return Client.findByIdAndDelete(id, { new: true });
};

/**
 * Assigns a supervisor to a client.
 * @function
 * @param {string} clientId - The id of the client.
 * @param {string} supervisorId - The id of the supervisor.
 * @returns {Promise<Client>}
 */
const assignSupervisorToClient = async (clientId, supervisorId) => {
  return Client.findOneAndUpdate(
    { _id: clientId },
    { $set: { supervisor: supervisorId } },
    {
      new: true,
    }
  );
};

export {
  getClient,
  getClients,
  createClient,
  updateClient,
  deleteClient,
  assignSupervisorToClient,
};
