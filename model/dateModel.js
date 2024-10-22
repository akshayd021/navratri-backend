const mongoose = require("mongoose");

const dateSchema = new mongoose.Schema({
  date: { type: Date, required: true },
}, { timestamps: true }); // Automatically adds createdAt and updatedAt fields

const DateModel = mongoose.model("Date", dateSchema);

module.exports = DateModel;
