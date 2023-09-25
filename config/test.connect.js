const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost:27017/mycra_dev")
  .then(async () => {
    console.log("connected");

    try {
      const collections = mongoose.connection.collections;

      for (const key in collections) {
        await collections[key].deleteMany();
      }

      console.log("All data has been deleted.");
    } catch (error) {
      console.error("An error occurred while deleting data:", error);
    }
  })
  .catch((err) => {
    console.log(err);
  });

module.exports = mongoose;
