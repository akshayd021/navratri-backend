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
 
  quantity: {
    type: Number,
    required: true,
  },
  selectedDates: [  
    {
      date: {
        type: String,
        required: true,
      },
      status: {
        type: String,
        enum: ["pending", "accepted", "rejected"],
        default: "pending",
      },
    },
  ],
  date: {
    type: Date,
    default: Date.now,
  },
  UserLink: {
    type: String,
  },
  firstName :{
    type :String, 
  },
  lastName :{
    type :String, 
  }
});

const Pass = mongoose.model("Pass", passSchema);

module.exports = Pass;
