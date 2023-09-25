const mongoose = require("mongoose");
//azerty
mongoose
  .connect("mongodb+srv://asma:as123456@cluster0.lpcnbkp.mongodb.net/mycra_test?retryWrites=true&w=majority")
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
