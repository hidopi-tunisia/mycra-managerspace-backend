import { CRA } from "../models";
import { CRAStatuses } from "../models/cra";
import { countData, populateData } from "../utils/data-options";
import { CRANotFoundError } from "../utils/errors/cras";

const getCRAs = async ({
  consultant,
  supervisor,
  page,
  limit,
  sort,
  project,
  client,
  year,
  month,
  createdAtMin,
  createdAtMax,
  submittedAtMin,
  submittedAtMax,
  // Use this on demand
  populate,
  count,
} = {}) => {
  const predicate = {};
  if (consultant) {
    predicate["consultant"] = consultant;
  } else if (supervisor) {
    predicate["supervisor"] = supervisor;
  }
  if (project) {
    predicate["project"] = project;
  } else if (client) {
    predicate["client"] = client;
  }
  if (year !== undefined || month !== undefined) {
    if (year !== undefined && month === undefined) {
      predicate["date.year"] = year;
    } else if (year === undefined && month !== undefined) {
      predicate["date.month"] = month;
    } else if (year !== undefined && month !== undefined) {
      predicate["date.year"] = year;
      predicate["date.month"] = month;
    }
  } else if (createdAtMin || createdAtMax) {
    if (start && !end) {
      predicate["createdAt"] = {
        $gte: new Date(createdAtMin),
      };
    } else if (!createdAtMin && createdAtMax) {
      predicate["createdAt"] = {
        $lt: new Date(end),
      };
    } else {
      predicate["createdAt"] = {
        $gte: new Date(createdAtMin),
        $lt: new Date(createdAtMax),
      };
    }
  } else if (submittedAtMin || submittedAtMax) {
    if (start && !end) {
      predicate["submittedAt"] = {
        $gte: new Date(submittedAtMin),
      };
    } else if (!submittedAtMin && submittedAtMax) {
      predicate["submittedAt"] = {
        $lt: new Date(end),
      };
    } else {
      predicate["submittedAtAt"] = {
        $gte: new Date(submittedAtMin),
        $lt: new Date(submittedAtMax),
      };
    }
  }
  return CRA.find(predicate)
    .skip(page * limit)
    .limit(limit)
    .sort({ createdAt: sort === "ASC" ? 1 : -1 });
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
