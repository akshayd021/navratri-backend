const mongoose = require("mongoose");
const { Schema } = mongoose;

const passSchema = new Schema({
  type: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  selectedDates: [
    {
      date: Date, // Date field
      status: { type: String, default: "pending" }, // Status with default
    },
  ],
  date: {
    type: Date,
    default: Date.now,
  },
  UserLink: {
    type: String,
  },
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  total: {
    type: Number,
  },
});

const Pass = mongoose.model("Pass", passSchema);

module.exports = Pass;
