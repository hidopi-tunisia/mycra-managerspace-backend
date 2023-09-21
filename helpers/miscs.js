import axios from "axios";

export const HolidayCountries = {
  FRANCE: "fr",
};
const getHolidays = async (
  country = HolidayCountries.FRANCE,
  year = new Date().getFullYear(),
  month
) => {
  const endpoint = process.env[`HOLIDAYS_ENDPOINT_${country.toUpperCase()}`];
  const { data } = await axios.get(`${endpoint}/${year}`);
  if (!isNaN(month) && month <= 12 && month >= 1) {
    let m;
    if (month < 10) {
      m = `0${month}`;
    } else {
      m = month;
    }
    return data.filter(({ date }) => date.split("-")[1] === m);
  }
  return data;
};

const getWeekends = (
  year = new Date().getFullYear(),
  month = new Date().getMonth()
) => {
  var saturdays = [];
  var sundays = [];
  for (var i = 0; i <= new Date(year, month, 0).getDate(); i++) {
    var date = new Date(year, month, i);
    if (date.getDay() == 6) {
      saturdays.push(date.getDate());
    } else if (date.getDay() == 0) {
      sundays.push(date.getDate());
    }
  }
  return {
    sundays,
    saturdays,
  };
};

export { getHolidays, getWeekends };
