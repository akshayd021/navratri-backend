const Pass = require("../model/passModel");

// Function to parse custom date formats
const parseCustomDate = (dateStr) => {
    // Example: "Day-8 12 Oct / Sat"
    // Adjust the parsing logic as necessary based on your actual input format
    const dateParts = dateStr.split(' ');
    if (dateParts.length < 2) return new Date(NaN); // Return Invalid Date

    const day = dateParts[1]; // Example: "12"
    const month = dateParts[2]; 
    const year = new Date().getFullYear();

    return new Date(`${month} ${day}, ${year}`);
};

const Passes = async (req, res) => {
    const { type, quantity, selectedDates, price } = req.body;

    if (!Array.isArray(selectedDates) || selectedDates.length === 0 || selectedDates.length > 3) {
        return res.status(400).json({ error: "You must select 1 to 3 dates." });
    }

    // Parse dates
    const parsedDates = selectedDates.map(date => {
        const parsedDate = parseCustomDate(date);
        if (isNaN(parsedDate)) {
            console.error(`Invalid date: ${date}`);
            throw new Error(`Invalid date: ${date}`);
        }
        return parsedDate;
    });

    try {
        const newPass = new Pass({ type, price, quantity, selectedDates: parsedDates });
        await newPass.save();
        res.status(201).json(newPass);
    } catch (error) {
        console.error("Error saving pass:", error);
        res.status(400).json({ error: error.message });
    }
};

const getPasses = async (req, res) => {
    try {
        const passes = await Pass.find();
        res.json(passes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }   
};
const getPass = async (req, res) => {
    const {_id} = req?.body
    try {
        const passe = await Pass.findById(_id);
        res.status(200).json(passe);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { Passes, getPass , getPasses};
