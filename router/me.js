import { Router } from "express";
import { getConsultant, updateConsultant } from "../helpers/consultants";
import { createCRA, getCRA, getCRAs, updateCRA } from "../helpers/cras";
import { HolidayCountries, getHolidays, getWeekends } from "../helpers/miscs";
import { getSupervisor } from "../helpers/supervisors";
import { Groups, Roles, checkGroup } from "../middlewares/check-group";
import { CRAStatuses } from "../models/cra";
import { ForbiddenError, handleError } from "../utils";
import {
  filtedCRAsByStatus,
  filterCurrentProjects,
  sortCRAsByHistory,
} from "../utils/data-options";
import { CRANotRejectedError } from "../utils/errors/cras";
import {
  NoCurrentProjectsError,
  NoProjectsError,
  ProjectNotFoundError,
} from "../utils/errors/projects";
import { StatusCodes } from "../utils/status-codes";

const router = Router();

router.get(
  "/",
  checkGroup(Groups.SUPERVISORS_OR_CONSULTANTS),
  async (req, res) => {
    try {
      const { user } = req;
      const { populate, count } = req.query;
      const options = {};
      if (typeof populate === "string") {
        options["populate"] = populate;
      }
      if (typeof count === "string") {
        options["count"] = count;
      }
      let result;
      switch (user.role) {
        case Roles.SUPERVISOR:
          result = await getSupervisor(user.uid, options);
          break;
        case Roles.CONSULTANT:
          result = await getConsultant(user.uid, options);
          break;

        default:
          break;
      }
      res.status(StatusCodes.OK).send(result);
    } catch (error) {
      handleError({ res, error });
    }
  }
);

router.put(
  "/",
  checkGroup(Groups.SUPERVISORS_OR_CONSULTANTS),
  async (req, res) => {
    try {
      const { user, body } = req;
      let result;
      switch (user.role) {
        case Roles.SUPERVISOR:
          result = await updateSupervisor(user.uid, body);
          break;
        case Roles.CONSULTANT:
          result = await updateConsultant(user.uid, body);
          break;

        default:
          break;
      }
      res.status(StatusCodes.OK).send(result);
    } catch (error) {
      handleError({ res, error });
    }
  }
);
router.post(
  "/projects/:id/cras",
  checkGroup(Groups.CONSULTANTS),
  async (req, res) => {
    try {
      const { user, body, params } = req;
      const { projects } = await getConsultant(user.uid);
      if (!projects.includes(params.id)) {
        throw new ProjectNotFoundError();
      }
      const status = CRAStatuses.PENDING;
      const history = [
        {
          action: CRAStatuses.SUBMITTED,
          meta: {
            at: new Date(),
            by: {
              _id: user.uid,
              role: Roles.CONSULTANT,
            },
          },
        },
      ];
      const year = new Date().getFullYear();
      const month = new Date().getMonth();
      const h = await getHolidays(HolidayCountries.FRANCE, year, month + 1);
      const w = getWeekends(year, month);
      const holidays = h.map(({ date, name }) => ({
        date,
        meta: {
          value: name,
        },
      }));
      const { saturdays, sundays } = w;
      const d0 = sundays.map((d) => ({
        date: new Date(year, month, d + 1).toISOString().substring(0, 10),
        meta: {
          value: 0,
        },
      }));
      const d6 = saturdays.map((d) => ({
        date: new Date(year, month, d + 1).toISOString().substring(0, 10),
        meta: {
          value: 6,
        },
      }));
      const weekends = [...d0, ...d6];
      const date = { month, year };
      const result = await createCRA({
        ...body,
        holidays,
        weekends,
        history,
        status,
        date,
        project: params.id,
        consultant: user.uid,
      });
      res.status(StatusCodes.CREATED).send(result);
    } catch (error) {
      handleError({ res, error });
    }
  }
);
router.put("/cras/:id", checkGroup(Groups.CONSULTANTS), async (req, res) => {
  try {
    const { user, body, params } = req;
    const cra = await getCRA(params.id);
    if (!cra.consultant.equals(user.uid)) {
      throw new ForbiddenError();
    }
    if (cra.status !== CRAStatuses.REJECTED) {
      throw new CRANotRejectedError();
    }
    const status = CRAStatuses.PENDING;
    const history = [
      ...cra.history,
      {
        action: CRAStatuses.SUBMITTED,
        meta: {
          at: new Date(),
          by: {
            _id: user.uid,
            role: Roles.CONSULTANT,
          },
        },
      },
    ];
    const result = await updateCRA(params.id, {
      ...body,
      history,
      status,
    });
    res.status(StatusCodes.OK).send(result);
  } catch (error) {
    handleError({ res, error });
  }
});

// http://localhost:30000/me/cras?page=1&limit=2&sort=desc&year=2023&month=5&start=2020-02-22&end=2020-10-23
router.get("/cras", async (req, res) => {
  try {
    const { user } = req;
    const {
      page,
      limit,
      sort,
      project,
      consultant,
      client,
      year,
      month,
      "created-at-min": camin,
      "created-at-max": camax,
      populate,
      count,
    } = req.query;
    const options = {};
    if (!isNaN(page) && page >= 0) {
      options["page"] = page;
    }
    if (!isNaN(limit) && limit > 0) {
      options["limit"] = limit;
    }
    if (sort === "asc" || sort === "desc") {
      options["sort"] = sort;
    }
    if (typeof project === "string") {
      options["project"] = project;
    }
    if (typeof consultant === "consultant") {
      options["consultant"] = consultant;
    }
    if (typeof client === "client") {
      options["client"] = client;
    }
    if (!isNaN(year) && Number(year) >= 2000) {
      options["year"] = Number(year);
    }
    if (!isNaN(month) && Number(month) >= 0 && Number(month) <= 11) {
      options["month"] = Number(month);
    }
    if (typeof camin === "string") {
      options["createdAtMin"] = camin;
    }
    if (typeof camax === "string") {
      options["createdAtMax"] = camax;
    }
    if (typeof populate === "string") {
      options["populate"] = populate;
    }
    if (typeof count === "string") {
      options["count"] = count;
    }
    let result;
    switch (user.role) {
      case Roles.SUPERVISOR:
        options["supervisor"] = user.uid;
        result = await getCRAs(options);
        break;
      case Roles.CONSULTANT:
        options["consultant"] = user.uid;
        result = await getCRAs(options);
        break;

      default:
        break;
    }
    res.status(StatusCodes.OK).send(result);
  } catch (error) {
    handleError({ res, error });
  }
});

router.get(
  "/cras/current",
  checkGroup(Groups.CONSULTANTS),
  async (req, res) => {
    try {
      const { user } = req;
      const { projects } = await getConsultant(user.uid, {
        populate: "projects",
      });
      if (!Array.isArray(projects) || projects.length === 0) {
        throw new NoProjectsError();
      }
      const today = new Date();
      const currentProjects = filterCurrentProjects(projects, today);
      if (!Array.isArray(currentProjects) || currentProjects.length === 0) {
        throw new NoCurrentProjectsError();
      }
      const month = today.getMonth();
      const year = today.getFullYear();
      const cras = await getCRAs({
        projectIds: currentProjects.map((p) => p._id),
        month,
        year,
      });
      let criteria = CRAStatuses.REJECTED;
      const rejectedCRAs = [...cras.filter(filtedCRAsByStatus(criteria))];
      let sortedRejectedCRAs;
      if (rejectedCRAs.length > 0) {
        sortedRejectedCRAs = [
          ...rejectedCRAs.sort(sortCRAsByHistory(criteria)),
        ];
      }
      criteria = CRAStatuses.APPROVED;
      const approvedCRAs = [...cras.filter(filtedCRAsByStatus(criteria))];
      let sortedApprovedCRAs;
      if (approvedCRAs.length > 0) {
        sortedApprovedCRAs = [
          ...approvedCRAs.sort(sortCRAsByHistory(criteria)),
        ];
      }
      criteria = CRAStatuses.PENDING;
      const pendingCRAs = [...cras.filter(filtedCRAsByStatus(criteria))];
      let sortedPendingCRAs;
      if (pendingCRAs.length > 0) {
        sortedPendingCRAs = [...pendingCRAs.sort(sortCRAsByHistory(criteria))];
      }
      let result = {
        approved: [],
        pending: [],
        rejected: [],
      };
      if (Array.isArray(sortedApprovedCRAs) && sortedApprovedCRAs.length > 0) {
        result.approved = sortedApprovedCRAs;
      }
      if (Array.isArray(sortedPendingCRAs) && sortedPendingCRAs.length > 0) {
        result.pending = sortedPendingCRAs;
      }
      if (Array.isArray(sortedRejectedCRAs) && sortedRejectedCRAs.length > 0) {
        result.rejected = sortedRejectedCRAs;
      }
      res.status(StatusCodes.OK).send(result);
    } catch (error) {
      handleError({ res, error });
    }
  }
);

export default router;
