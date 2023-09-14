import { dirname } from "path";
import { fileURLToPath } from "url";

import { promisify } from "util";
import { readFile } from "fs";

String.prototype.replaceAll = function (search, replacement) {
  var target = this;
  return target.replace(new RegExp(search, "g"), replacement);
};

const APP_NAME = process.env.APP_NAME;
const __dirname = dirname(fileURLToPath(import.meta.url));

const read = promisify(readFile);
const extractTemplate = async (filename) => {
  const str = await read(`${__dirname}/templates/${filename}.html`, "utf8");
  return str;
};
const generateTemplate = async (placeholders = {}) => {
  let str = await extractTemplate("welcome_admin");
  str = str.replaceAll("%APP_NAME%", APP_NAME);
  Object.keys(placeholders).forEach((element) => {
    str = str.replaceAll(`%${element}%`, placeholders[element]);
  });
  return str;
};

export { generateTemplate };
