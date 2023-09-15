export const populateData = (doc, paths) => {
  return doc.populate(paths.split(",").map((path) => path));
};

export const countData = (doc, paths) => {
  const count = {};
  paths.split(",").forEach((path) => {
    count[path] = doc[path].length;
  });
  return count;
};
