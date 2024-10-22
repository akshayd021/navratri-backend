const DateModel = require("../model/dateModel"); // Import the Date model

// Create a new date
const createDate = async (req, res) => {
  const { date } = req.body; // Expecting a date to be passed in the request body

  if (!date) {
    return res.status(400).json({ error: "Date is required" });
  }

  try {
    const newDate = new DateModel({ date: new Date(date) });
    await newDate.save();
    res.status(201).json(newDate); // Return the newly created date
  } catch (error) {
    console.error("Error creating date:", error);
    res.status(500).json({ error: error.message });
  }
};

// Read all dates
const getAllDates = async (req, res) => {
  try {
    const dates = await DateModel.find(); // Retrieve all dates
    res.status(200).json(dates);
  } catch (error) {
    console.error("Error retrieving dates:", error);
    res.status(500).json({ error: error.message });
  }
};

// Read a single date by ID
const getDateById = async (req, res) => {
  const { id } = req.params;

  try {
    const date = await DateModel.findById(id); // Find date by ID
    if (!date) {
      return res.status(404).json({ error: "Date not found" });
    }
    res.status(200).json(date);
  } catch (error) {
    console.error("Error retrieving date:", error);
    res.status(500).json({ error: error.message });
  }
};

// Update a date by ID
const updateDateById = async (req, res) => {
  const { id } = req.params;
  const { date } = req.body;

  if (!date) {
    return res.status(400).json({ error: "New date is required" });
  }

  try {
    const updatedDate = await DateModel.findByIdAndUpdate(id, { date: new Date(date) }, { new: true });
    if (!updatedDate) {
      return res.status(404).json({ error: "Date not found" });
    }
    res.status(200).json(updatedDate);
  } catch (error) {
    console.error("Error updating date:", error);
    res.status(500).json({ error: error.message });
  }
};

// Delete a date by ID
const deleteDateById = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedDate = await DateModel.findByIdAndDelete(id); // Delete date by ID
    if (!deletedDate) {
      return res.status(404).json({ error: "Date not found" });
    }
    res.status(200).json({ message: "Date deleted successfully" });
  } catch (error) {
    console.error("Error deleting date:", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createDate,
  getAllDates,
  getDateById,
  updateDateById,
  deleteDateById,
};
