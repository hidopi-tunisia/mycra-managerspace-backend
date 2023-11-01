import { Alert } from "../models/index.js";

const getAlert = async (id) => {
  return Alert.findById(id);
};

const getAlerts = async ({
  page,
  limit,
  sort,
  consultant,
  supervisor,
  createdAtMin,
  createdAtMax,
  isRead,
  populate,
} = {}) => {
  const predicate = {};
  if (consultant) {
    predicate["consultant"] = consultant;
  }
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
  let docs;
  if (populate) {
    docs = await Alert.find(predicate)
      .skip(page * limit)
      .limit(limit)
      .sort({ createdAt: sort === "asc" ? 1 : -1 })
      .populate(populate.split(",").map((path) => path));
  } else {
    docs = await Alert.find(predicate)
      .skip(page * limit)
      .limit(limit)
      .sort({ createdAt: sort === "asc" ? 1 : -1 });
  }
  return docs;
};

const createAlert = async (payload) => {
  return new Alert({ ...payload }).save();
};

const updateAlert = async (id, payload) => {
  return Alert.findByIdAndUpdate(id, { ...payload }, { new: true });
};

const toggleAlertIsRead = async (id, isRead) => {
  return Alert.findByIdAndUpdate(id, { isRead }, { new: true });
};

const deleteAlert = async (id) => {
  return Alert.findByIdAndDelete(id, { new: true });
};

export {
  getAlert,
  createAlert,
  deleteAlert,
  updateAlert,
  toggleAlertIsRead,
  getAlerts,
};
