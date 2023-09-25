const mongoose = require("mongoose");

mongoose
  .connect(
    "mongodb+srv://hidopi:as123456@mycraclusterdev.do0ivve.mongodb.net/mycra_dev?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("connected");
  })
  .catch((err) => {
    console.log(err);
  });

module.exports = mongoose;
