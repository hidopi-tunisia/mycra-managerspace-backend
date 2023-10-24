import { CRA } from "../../../models/index.js";

const getCRAsCount = async ({
  supervisor,
  consultant,
  project,
  client,
  year,
  month,
  createdAtMin,
  createdAtMax,
} = {}) => {
  const predicate = {};
  if (supervisor) {
    predicate["supervisor"] = supervisor;
  }
  if (consultant) {
    predicate["consultant"] = consultant;
  }
  if (client) {
    predicate["client"] = client;
  }
  if (project) {
    predicate["project"] = project;
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
  const count = await CRA.countDocuments(predicate);
  return { count };
};
export { getCRAsCount };
