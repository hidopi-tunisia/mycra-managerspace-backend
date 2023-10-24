import { Consultant } from "../../../models/index.js";

const getConsultantsCount = async ({
  sex,
  createdAtMin,
  createdAtMax,
  supervisor,
} = {}) => {
  const predicate = {};
  if (supervisor) {
    predicate["supervisor"] = supervisor;
  }
  if (sex) {
    predicate["sex"] = sex;
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
  const count = await Consultant.countDocuments(predicate);
  return { count };
};

export { getConsultantsCount };