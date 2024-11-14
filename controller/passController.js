const Pass = require("../model/passModel");
const { sendEmail } = require("../utils/sendMail");

const parseCustomDate = (dateStr) => {
  if (!dateStr || typeof dateStr !== "string") return new Date(NaN);

  const [day, month, year] = dateStr.split("/");
  return day && month && year
    ? new Date(`${year}-${month}-${day}`)
    : new Date(NaN);
};

const Passes = async (req, res) => {
  const [passData] = req.body;
  if (!passData)
    return res.status(400).json({ error: "No pass data provided." });

  const {
    type,
    quantity,
    selectedDates = [],
    price,
    firstName,
    lastName,
    total,
    discount,
    email,
  } = passData;

  if (selectedDates.length === 0) {
    return res
      .status(400)
      .json({ error: "Selected dates must be a non-empty array." });
  }

  // Parse dates, ensuring only valid dates are processed
  const parsedDates = selectedDates.map((date) => {
    const parsedDate = parseCustomDate(date);
    if (isNaN(parsedDate)) {
      console.error(`Invalid date format: ${date}`);
      return res.status(400).json({ error: `Invalid date format: ${date}` });
    }
    return { date: parsedDate, status: "pending" };
  });

  try {
    const newPass = new Pass({
      type,
      price,
      quantity,
      selectedDates: parsedDates,
      firstName,
      lastName,
      total,
      discount,
      email,
    });
    await newPass.save();
    res.status(201).json(newPass);
  } catch (error) {
    console.error("Error saving pass:", error);
    res.status(500).json({ error: error.message });
  }
};

const updatePassStatus = async (req, res) => {
  const { _id, date, action } = req.body;

  if (!action || !_id || !date) {
    return res
      .status(400)
      .json({ error: "Action, Pass ID, or Date not provided" });
  }

  try {
    const pass = await Pass.findById(_id);

    if (!pass) {
      return res.status(404).json({ error: "Pass not found" });
    }

    const parsedInputDate = parseCustomDate(date);

    const dateToUpdate = pass.selectedDates.find(
      (d) => d.date.toISOString() === parsedInputDate.toISOString() // Compare using toISOString()
    );

    if (!dateToUpdate) {
      return res.status(404).json({ error: "Date not found in selectedDates" });
    }

    if (action === "accept") {
      dateToUpdate.status = "accepted";
    } else if (action === "pending") {
      dateToUpdate.status = "Pending";
    } else {
      return res.status(400).json({ error: "Invalid action" });
    }

    await pass.save();
    return res.json({
      success: true,
      message: `Date ${date} has been ${
        action === "accept" ? "accepted" : "pending"
      }`,
      pass, // Return the updated pass data
    });
  } catch (error) {
    console.error("Error updating date status:", error);
    res.status(500).json({ error: error.message });
  }
};

const updatePassDetails = async (req, res) => {
  const { _id, type, quantity } = req.body;

  if (!_id || !type || !quantity) {
    return res.status(400).json({
      error: "Pass ID, type, quantity, and selectedDates are required",
    });
  }

  try {
    const updatedPass = await Pass.findByIdAndUpdate(
      _id,
      { type, quantity },
      { new: true }
    );

    if (!updatedPass) {
      return res.status(404).json({ error: "Pass not found" });
    }

    res.json({
      success: true,
      message: "Pass details updated successfully",
      pass: updatedPass,
    });
  } catch (error) {
    console.error("Error updating pass details:", error);
    res.status(500).json({ error: error.message });
  }
};

const sendMail = async (req, res) => {
  const { passes, email, firstName, lastName, _id } = req.body;
  const dummyLink = `http://localhost:3000/user-pass/${_id}`;

  try {
    const passDetails = passes.map((pass) => ({
      ...pass,
      firstName,
      email,
      lastName,
      selectedDates: pass.selectedDates.map((date) =>
        date instanceof Date ? date.toLocaleDateString("en-GB") : date
      ),
    }));

    await sendEmail(email, passDetails, dummyLink, lastName, firstName);
    res
      .status(200)
      .json({ message: "Passes saved and email sent", passDetails });
  } catch (error) {
    console.error("Error in sendMail:", error.message);
    res.status(500).json({ error: "Failed to send email", success: false });
  }
};

const getPass = async (req, res) => {
  const { id } = req.params;

  try {
    const pass = await Pass.findOne({ _id: id });

    if (!pass) {
      return res
        .status(400)
        .json({ success: false, message: "Pass Not Found!" });
    }

    return res.status(200).json({ success: true, pass });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

const handlePassAction = async (req, res) => {
  const { action, dateId } = req.body;
  try {
    if (!action || !dateId) {
      return res
        .status(400)
        .json({ success: false, message: "Action or dateId missing." });
    }

    const pass = await Pass.findOne({
      "selectedDates._id": dateId,
    });

    if (!pass) {
      return res.status(404).json({
        success: false,
        message: "Pass with the specified dateId not found.",
      });
    }

    const dateIndex = pass.selectedDates.findIndex(
      (d) => d._id.toString() === dateId
    );

    if (dateIndex === -1) {
      return res
        .status(404)
        .json({ success: false, message: "Date not found in selectedDates." });
    }

    pass.selectedDates[dateIndex].status =
      action === "accept" ? "accepted" : "pending";

    await pass.save();

    return res.status(200).json({
      success: true,
      message: `Pass date has been ${action}ed successfully.`,
    });
  } catch (error) {
    console.error("Error processing pass action:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

const getAllPasses = async (req, res) => {
  try {
    const passes = await Pass.find({});

    if (!passes) {
      return res
        .status(400)
        .json({ success: false, message: "Pass Not Found!" });
    }

    return res.status(200).json({ success: true, passes });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  Passes,
  updatePassStatus,
  updatePassDetails,
  sendMail,
  getPass,
  handlePassAction,
  getAllPasses,
};
