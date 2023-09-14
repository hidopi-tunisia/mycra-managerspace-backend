import { Types } from "mongoose";

const generateObjectId = (length = 24) => {
  if (length) {
    return new Types.ObjectId(length);
  }
  return new Types.ObjectId();
};

const generateString = (length = 12) => {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
};

export { generateString, generateObjectId };
