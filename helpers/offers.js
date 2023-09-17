import { Supervisor, Offer } from "../models";
import { countData, populateData } from "../utils/data-options";
import { OfferNotFoundError } from "../utils/errors/offers";

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

const createOffer = async (payload) => {
  return new Offer({ ...payload }).save();
};

/**
 * Affects an offer to a supervisor.
 * @function
 * @param {string} offerId - The id of the offer.
 * @param {string} supervisorId - The id of the supervisor.
 * @returns {Promise<Offer>}
 */
const affectOfferToSupervisor = async (offerId, supervisorId) => {
  return Supervisor.findOneAndUpdate(
    { _id: supervisorId },
    { $set: { offer: offerId } },
    {
      new: true,
    }
  );
};

/**
 * Unaffects an offer form a supervisor.
 * @function
 * @param {string} offerId - The id of the offer.
 * @param {string} supervisorId - The id of the supervisor.
 * @returns {Promise<Offer>}
 */
const unaffectOfferFromSupervisor = async (supervisorId) => {
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
  createOffer,
  affectOfferToSupervisor,
  unaffectOfferFromSupervisor,
};
