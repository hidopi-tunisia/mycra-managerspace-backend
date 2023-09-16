import { CRA } from "../models";
import { CRAStatuses } from "../models/cra";
import { CRANotFoundError } from "../utils/errors/cras";

const getCRA = async (id, options = {}) => {
  let doc = await CRA.findById(id);
  if (!doc) {
    throw new CRANotFoundError();
  }
  if (options.populate) {
    if (options.join.split(",").includes("consultant")) {
      doc = await doc.populate({
        path: "consultant",
      });
    }
    if (options.populate.split(",").includes("project")) {
      doc = await doc.populate({
        path: "project",
      });
    }
  }
  return doc;
};

const createCRA = async (payload) => {
  return new CRA({ ...payload }).save();
};

const rejectCRA = async (id, action) => {
  return CRA.findOneAndUpdate(
    { _id: id, status: CRAStatuses.PENDING },
    { $set: { status: CRAStatuses.REJECTED }, $addToSet: { history: action } },
    {
      new: true,
    }
  );
};

const approveCRA = async (id, action) => {
  return CRA.findOneAndUpdate(
    {
      _id: id,
      $or: [{ status: CRAStatuses.PENDING }, { status: CRAStatuses.REJECTED }],
    },
    { $set: { status: CRAStatuses.APPROVED }, $addToSet: { history: action } },
    {
      new: true,
    }
  );
};

export { getCRA, createCRA, rejectCRA, approveCRA };
