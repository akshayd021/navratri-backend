// models/PromoCode.js
const mongoose = require("mongoose");

const promoCodeSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    uppercase: true, // Enforce uppercase
  },
  discountType: {
    type: String,
    enum: ["fixed", "percentage"], // Options for discount
    required: true,
  },
  discountValue: {
    type: Number,
    required: true,
    min: [0, "Discount value must be positive"],
  },
  minPurchase: {
    type: Number,
    required: true,
    min: [5000, "Minimum purchase must be at least 5000"], // Enforce minimum value
  },
});

module.exports = mongoose.model("PromoCode", promoCodeSchema);
