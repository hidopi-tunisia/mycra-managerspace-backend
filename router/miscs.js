import axios from "axios";
import { Router } from "express";
import { handleError } from "../utils";
import { InvalidCountryError, InvalidYearError } from "../utils/errors/miscs";
import { StatusCodes } from "../utils/status-codes";

const router = Router();
const HolidayCountries = {
  FRANCE: "fr",
};
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
    let endpoint = process.env[`HOLIDAYS_ENDPOINT_${country.toUpperCase()}`];
    const { data } = await axios.get(`${endpoint}/${year}`);
    res.status(StatusCodes.OK).send(data);
  } catch (error) {
    handleError({ res, error });
  }
});

export default router;
