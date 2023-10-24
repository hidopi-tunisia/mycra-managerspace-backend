import { Project } from "../../../models/index.js";

const getProjectsCount = async ({
  client,
  category,
  status,
  createdAtMin,
  createdAtMax,
  supervisor,
} = {}) => {
  const predicate = {};
  if (supervisor) {
    predicate["supervisor"] = supervisor;
  }
  if (client) {
    predicate["client"] = client;
  }
  if (category) {
    predicate["category"] = category;
  }
  if (status) {
    predicate["status"] = status;
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
  const count = await Project.countDocuments(predicate);
  return { count };
};

export { getProjectsCount };
