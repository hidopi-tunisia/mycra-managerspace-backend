import mongoose from "mongoose";

const DATABASE_CONNECTION = process.env.DATABASE_CONNECTION;

mongoose
  .connect(DATABASE_CONNECTION)
  .then(() => {
    console.log("Connected to the database");
  })
  .catch((err) => {
    console.log(err);
  });

export default this;
