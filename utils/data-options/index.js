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

export const filterCurrentProjects = (projects, date) => {
  return projects.filter((p) => {
    const d = new Date(date).getTime();
    const sd = new Date(p.startDate).getTime();
    const ed = new Date(p.endDate).getTime();
    if (d >= sd && d < ed) {
      return p;
    }
  });
};

export const sortCRAsByStatus = (a, b) => {
  const actionOrder = { rejected: 0, pending: 1, approved: 2, submitted: 3 };
  return actionOrder[a.status] - actionOrder[b.status];
};

export const filtedCRAsByStatus =
  (s) =>
  ({ status }) =>
    status === s;

export const sortCRAsByHistory = (s) => (a, b) => {
  const filteredHistoryA = a.history.filter(({ action }) => action === s);
  const filteredHistoryB = b.history.filter(({ action }) => action === s);
  const sortedHistoryA = filteredHistoryA.sort(
    (x, y) => new Date(y?.meta?.at).getTime() - new Date(x?.meta?.at).getTime()
  );
  const sortedHistoryB = filteredHistoryB.sort(
    (x, y) => new Date(y?.meta?.at).getTime() - new Date(x?.meta?.at).getTime()
  );
  const diff =
    new Date(sortedHistoryA[0]?.meta?.at).getTime() -
    new Date(sortedHistoryB[0]?.meta?.at).getTime();
  return diff;
};
