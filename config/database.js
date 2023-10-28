import mongoose from "mongoose";

const DATABASE_CONNECTION = process.env.DATABASE_CONNECTION;

mongoose
  .connect(DATABASE_CONNECTION)
  .then(() => {
    console.info("Connected to the database");
  })
  .catch((error) => {
    console.log(error);
  });

export default this;
