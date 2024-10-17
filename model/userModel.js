const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    mobile: { type: String, required: true },
    address: { type: String, required: true },
    passes: { type: Array, default: [] },
    dummyLink: { type: String },
    linkUsed: { type: Boolean, default: false },
    linkStatus: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' }
});

const User = mongoose.model("User", userSchema);

module.exports = User;
