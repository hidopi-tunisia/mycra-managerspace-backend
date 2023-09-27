import { Client, Supervisor } from "../models";
import { countData, populateData } from "../utils/data-options";
import { SupervisorNotFoundError } from "../utils/errors/supervisors";

const getSupervisors = async ({
  page,
  limit,
  sort,
  offer,
  status,
  siret,
  companyName,
  street,
  city,
  zipCode,
  createdAtMin,
  createdAtMax,
  populate,
} = {}) => {
  const predicate = {};
  if (offer) {
    predicate["offer"] = offer;
  }
  if (status) {
    predicate["status"] = status;
  }
  if (companyName) {
    predicate["company.name"] = { $regex: companyName, $options: "i" };
  }
  if (siret) {
    predicate["company.siret"] = siret;
  }
  if (city) {
    predicate["company.address.city"] = { $regex: city, $options: "i" };
  }
  if (street) {
    predicate["company.address.street"] = { $regex: street, $options: "i" };
  }
  if (zipCode) {
    predicate["company.address.zipCode"] = zipCode;
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
    docs = await Supervisor.find(predicate)
      .skip(page * limit)
      .limit(limit)
      .sort({ createdAt: sort === "asc" ? 1 : -1 })
      .populate(populate.split(",").map((path) => path));
  } else {
    docs = await Supervisor.find(predicate)
      .skip(page * limit)
      .limit(limit)
      .sort({ createdAt: sort === "asc" ? 1 : -1 });
  }
  return docs;
};

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

const updateSupervisor = () => {
  return Supervisor.findByIdAndUpdate(id, payload, { new: true });
};
export {
  getSupervisors,
  getSupervisor,
  createSupervisor,
  updateSupervisor,
  assignSupervisorToClient,
};
