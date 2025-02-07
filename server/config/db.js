const mongoose = require("mongoose");

const connectDb = async (url) => {
  try {
    await mongoose.connect(url);
    ("successfully connected to the database");
  } catch (error) {
    (error);
  }
};

module.exports = connectDb;
