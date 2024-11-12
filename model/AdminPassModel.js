const mongoose = require("mongoose");

const passSchema = new mongoose.Schema({
  type: { type: String, required: true },
  price: { type: Number, required: true },
  threeDaysPrice: { type: Number, default: 0 },
  fiveDaysPrice: { type: Number, default: 0 },
  seasonPrice: { type: Number, default: 0 },
  isThreeDaysCombo: { type: Boolean, default: false },
  isFiveDaysCombo: { type: Boolean, default: false },
  seasonPass: { type: Boolean, default: false },
  maxQuantity: { type: Number, required: true }, 
  currentQuantity: { type: Number, default: 0 }, 
  isSoldout: {type :Boolean, default : false}
});

const AdminPass = mongoose.model("AdminPass", passSchema);

module.exports = AdminPass;
