import { Supervisor, Offer } from "../models/index.js";
import { countData, populateData } from "../utils/data-options/index.js";
import { OfferNotFoundError } from "../utils/errors/offers.js";

const getOffer = async (id, options = {}) => {
  let doc = await Offer.findById(id);
  let meta = {};
  if (!doc) {
    throw new OfferNotFoundError();
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

const getOffers = async () => {
  return Offer.find();
};

const createOffer = async (payload) => {
  return new Offer({ ...payload }).save();
};

const updateOffer = async (id, payload) => {
  return Offer.findByIdAndUpdate(id, { ...payload }, { new: true });
};

const deleteOffer = async (id) => {
  return Offer.findByIdAndDelete(id, { new: true });
};

/**
 * Assigns an offer to a supervisor.
 * @function
 * @param {string} offerId - The id of the offer.
 * @param {string} supervisorId - The id of the supervisor.
 * @returns {Promise<Offer>}
 */
const assignOfferToSupervisor = async (offerId, supervisorId) => {
  return Supervisor.findOneAndUpdate(
    { _id: supervisorId },
    { $set: { offer: offerId } },
    {
      new: true,
    }
  );
};

/**
 * Unassigns an offer form a supervisor.
 * @function
 * @param {string} offerId - The id of the offer.
 * @param {string} supervisorId - The id of the supervisor.
 * @returns {Promise<Offer>}
 */
const unassignOfferFromSupervisor = async (supervisorId) => {
  return Supervisor.findOneAndUpdate(
    { _id: supervisorId },
    { $unset: { offer: 1 } }, // Use 1 to unset the field
    {
      new: true,
    }
  );
};

export {
  getOffer,
  getOffers,
  createOffer,
  updateOffer,
  deleteOffer,
  assignOfferToSupervisor,
  unassignOfferFromSupervisor,
};
