import { HolidayCountries } from "../../helpers/miscs.js";
import data_fr from "./fr";

const getHolidaysData = (country, year = new Date().getFullYear()) => {
  if (country === HolidayCountries.FRANCE) {
    return data_fr.filter((d) => d.year === year);
  }
  return data_fr.filter((d) => d.year === year);
};

export { getHolidaysData };
