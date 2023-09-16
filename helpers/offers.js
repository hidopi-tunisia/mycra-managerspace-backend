import { Client, Offer } from "../models";
import { countData, populateData } from "../utils/data-options";
import { OfferNotFoundError } from "../utils/errors/projects";

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
 * Affects an offer to a client.
 * @function
 * @param {string} offerId - The id of the offer.
 * @param {string} clientId - The id of the client.
 * @returns {Promise<Offer>}
 */
const affectOfferToClient = async (offerId, clientId) => {
  return Client.findOneAndUpdate(
    { _id: clientId },
    { $set: { offer: offerId } },
    {
      new: true,
    }
  );
};

/**
 * Unaffects an offer form a client.
 * @function
 * @param {string} offerId - The id of the offer.
 * @param {string} clientId - The id of the client.
 * @returns {Promise<Offer>}
 */
const unaffectOfferFromClient = async (offerId, clientId) => {
  return Client.findOneAndUpdate(
    { _id: clientId },
    { $unset: { offer: offerId } },
    {
      new: true,
    }
  );
};

export { affectOfferToClient, createOffer, getOffer, unaffectOfferFromClient };
