const mongoose = require("mongoose");

const passSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  seasonPrice: {
    type: Number,
    default: null,
  },
  threeDaysPrice: {
    type: Number,
    default: null,
  },
  fiveDaysPrice: {
    type: Number,
    default: null,
  },
  isThreeDaysCombo: {
    type: Boolean,
    default: false,
  },
  isFiveDaysCombo: {
    type: Boolean,
    default: false,
  },
  seasonPass: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

const AdminPass = mongoose.model("AdminPass", passSchema);

module.exports = AdminPass;
