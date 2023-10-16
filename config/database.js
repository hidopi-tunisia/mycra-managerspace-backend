import mongoose from "mongoose";

const DATABASE_CONNECTION = process.env.DATABASE_CONNECTION;

mongoose
  .connect(DATABASE_CONNECTION)
  .then(() => {
    console.info("Connected to the database");
  })
  .catch((err) => {
    console.log(error);
  });

export default this;
