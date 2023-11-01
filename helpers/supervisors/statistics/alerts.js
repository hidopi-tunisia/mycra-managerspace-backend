import { Alert } from "../../../models/index.js";

const getAlertsCount = async ({
  createdAtMin,
  createdAtMax,
  supervisor,
  isRead,
} = {}) => {
  const predicate = {};
  if (supervisor) {
    predicate["supervisor"] = supervisor;
  }
  if (isRead !== undefined) {
    predicate["isRead"] = isRead;
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
  const count = await Alert.countDocuments(predicate);
  return { count };
};

export { getAlertsCount };
