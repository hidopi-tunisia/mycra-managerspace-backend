import { Manager, Offer } from "../models";
import { countData, populateData } from "../utils/data-options";
import { OfferNotFoundError } from "../utils/errors/offers";

const getOffer = async (id, options = {}) => {
  let doc = await Offer.findById(id);
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
 * Affects an offer to a manager.
 * @function
 * @param {string} offerId - The id of the offer.
 * @param {string} managerId - The id of the manager.
 * @returns {Promise<Offer>}
 */
const affectOfferToManager = async (offerId, managerId) => {
  return Manager.findOneAndUpdate(
    { _id: managerId },
    { $set: { offer: offerId } },
    {
      new: true,
    }
  );
};

/**
 * Unaffects an offer form a manager.
 * @function
 * @param {string} offerId - The id of the offer.
 * @param {string} managerId - The id of the manager.
 * @returns {Promise<Offer>}
 */
const unaffectOfferFromManager = async (offerId, managerId) => {
  return Manager.findOneAndUpdate(
    { _id: managerId },
    { $unset: { offer: offerId } },
    {
      new: true,
    }
  );
};

export {
  getOffer,
  createOffer,
  affectOfferToManager,
  unaffectOfferFromManager,
};
