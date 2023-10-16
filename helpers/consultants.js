import { Consultant, Supervisor } from "../models/index.js";
import { countData, populateData } from "../utils/data-options/index.js";
import { ConsultantNotFoundError } from "../utils/errors/consultants.js";
import { deleteUser } from "./auth.js";

const getConsultants = async ({
  page,
  limit,
  sort,
  status,
  firstName,
  lastName,
  email,
  createdAtMin,
  createdAtMax,
  populate,
} = {}) => {
  const predicate = {};
  if (status) {
    predicate["status"] = status;
  }
  if (firstName) {
    predicate["firstName"] = { $regex: firstName, $options: "i" };
  }
  if (lastName) {
    predicate["lastName"] = { $regex: lastName, $options: "i" };
  }
  if (email) {
    predicate["email"] = { $regex: lastName, $options: "i" };
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
    docs = await Consultant.find(predicate)
      .skip(page * limit)
      .limit(limit)
      .sort({ createdAt: sort === "asc" ? 1 : -1 })
      .populate(populate.split(",").map((path) => path));
  } else {
    docs = await Consultant.find(predicate)
      .skip(page * limit)
      .limit(limit)
      .sort({ createdAt: sort === "asc" ? 1 : -1 });
  }
  return docs;
};
const getConsultant = async (id, options = {}) => {
  let doc = await Consultant.findById(id);
  let meta = {};
  if (!doc) {
    throw new ConsultantNotFoundError();
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

const createConsultant = (payload) => {
  return new Consultant({ ...payload }).save();
};

const updateConsultant = (id, payload) => {
  return Consultant.findByIdAndUpdate(id, payload, { new: true });
};

const deleteConsultant = async (id, { keepIdentity = false }) => {
  if (keepIdentity === false) {
    await deleteUser(id);
  }
  return Consultant.findByIdAndDelete(id, { new: true });
};
export {
  getConsultant,
  getConsultants,
  createConsultant,
  updateConsultant,
  deleteConsultant,
};
