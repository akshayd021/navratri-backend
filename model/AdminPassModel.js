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
  discount: {
    type: Number,
    default: 0, // Optional: Default value if not specified
  },
  discountType: {
    type: String,
    enum: ['percentage', 'currency'], // Restrict to valid values
    default: 'percentage', // Optional: Default value
  },
  isThreeDaysCombo: {
    type: Boolean,
    default: false, // Optional: Default value for 3 days combo
  }
});

const AdminPass = mongoose.model("AdminPass", passSchema);

module.exports = AdminPass;
