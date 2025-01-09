const mongoose = require("mongoose");

const TicketUsersTestSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true, // this makes the field required
    unique: true, // every email in our DB has to be unique
    lowercase: true, // this will convert any email that comes into lowercase
    index: true, // this makes quering by email a lot faster, but it also makes the DB a little bit bigger
  },
  role: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
    default: "123",
  },
  designation: {
    type: String,
    required: true,
  },
  company: {
    type: String,
    required: true,
    default: "BIZ Nest",
  },
  phone: {
    type: String,
    required: true,
    default: "9876543201",
  },
});

const TicketUsersTest = mongoose.model(
  "TicketUsersTest",
  TicketUsersTestSchema
);

module.exports = TicketUsersTest;
