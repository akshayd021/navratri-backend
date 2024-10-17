const mongoose = require('mongoose');

const passSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['Gold', 'Platinum'],
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    selectedDates: {
        type: [Date],
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const Pass = mongoose.model('Pass', passSchema);

module.exports = Pass;
