import { Router } from "express";
import { getHolidays, getWeekends, HolidayCountries } from "../helpers/miscs";
import { handleError } from "../utils";
import {
  InvalidCountryError,
  InvalidMonthError,
  InvalidYearError,
} from "../utils/errors/miscs";
import { StatusCodes } from "../utils/status-codes";

const router = Router();
router.get("/dates/holidays", async (req, res) => {
  try {
    const {
      year = new Date().getFullYear(),
      country = HolidayCountries.FRANCE,
    } = req;
    if (isNaN(year) || year < new Date().getFullYear()) {
      throw new InvalidYearError();
    }
    if (!Object.values(HolidayCountries).includes(country.toLowerCase())) {
      throw new InvalidCountryError();
    }
    const result = await getHolidays(year, country);
    res.status(StatusCodes.OK).send(result);
  } catch (error) {
    handleError({ res, error });
  }
});
router.get("/dates/weekends", async (req, res) => {
  try {
    const { year = new Date().getFullYear(), month = new Date().getMonth() } =
      req;
    if (isNaN(year) || year < new Date().getFullYear()) {
      throw new InvalidYearError();
    }
    if (isNaN(year) || month < 0 || month > 11) {
      throw new InvalidMonthError();
    }
    const result = getWeekends(year, month);
    res.status(StatusCodes.OK).send(result);
  } catch (error) {
    handleError({ res, error });
  }
});

export default router;
