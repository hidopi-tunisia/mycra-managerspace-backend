import { CRA } from "../models";
import { CRAStatuses } from "../models/cra";
import { countData, populateData } from "../utils/data-options";
import { CRANotFoundError } from "../utils/errors/cras";

const getCRAs = async ({
  page,
  limit,
  sort,
  project,
  client,
  start,
  end,
  populate,
  count,
  consultant,
  manager,
} = {}) => {
  const predicate = {};
  if (consultant) {
    predicate["consultant"] = consultant;
  }
  else if (manager) {
    predicate["manager"] = manager;
  }
  console.log(predicate);
  return CRA.find(predicate)
    .skip(page * limit)
    .limit(limit)
    .sort({ submittedAt: sort === "ASC" ? 1 : -1 });
};

const getCRA = async (id, options = {}) => {
  let doc = await CRA.findById(id);
  let meta = {};
  if (!doc) {
    throw new CRANotFoundError();
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

export { getCRAs, getCRA, createCRA, rejectCRA, approveCRA };
