const Pass = require("../model/passModel");
const { sendEmail } = require("../utils/sendMail");

// Improved function to parse DD/MM/YYYY date format
const parseCustomDate = (dateStr) => {
  const [day, month, year] = dateStr.split("/"); // Split by "/"
  if (!day || !month || !year) return new Date(NaN); // Return Invalid Date if format is incorrect

  // Construct a new Date object using the split values
  return new Date(`${year}-${month}-${day}`); // Convert to YYYY-MM-DD for JavaScript Date
};

// Create Pass
const Passes = async (req, res) => {
  const { type, quantity, selectedDates, price } = req.body;

  if (
    !Array.isArray(selectedDates) ||
    selectedDates.length === 0 ||
    selectedDates.length > 3
  ) {
    return res.status(400).json({ error: "You must select 1 to 3 dates." });
  }

  // Parse dates and map them into objects with the `date` field
  const parsedDates = selectedDates.map((date) => {
    const parsedDate = parseCustomDate(date);
    if (isNaN(parsedDate)) {
      console.error(`Invalid date: ${date}`);
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
    });
    await newPass.save();
    res.status(201).json(newPass);
  } catch (error) {
    console.error("Error saving pass:", error);
    res.status(500).json({ error: error.message });
  }
};

  const updatePassStatus = async (req, res) => {
  const { _id, date, action } = req.body; // Expect pass _id, specific date (DD/MM/YYYY), and action (accept/reject)

  if (!action || !_id || !date) {
    return res
      .status(400)
      .json({ error: "Action, Pass ID, or Date not provided" });
  }

  try {
    // Find the pass by ID
    const pass = await Pass.findById(_id);

    if (!pass) {
      return res.status(404).json({ error: "Pass not found" });
    }

    // Convert the input date (DD/MM/YYYY) to Date object for comparison
    const parsedInputDate = parseCustomDate(date);

    // Find the specific date in selectedDates
    const dateToUpdate = pass.selectedDates.find(
      (d) => d.date.toISOString() === parsedInputDate.toISOString() // Compare using toISOString()
    );

    if (!dateToUpdate) {
      return res.status(404).json({ error: "Date not found in selectedDates" });
    }

    // Update the date status based on the action (accept/reject)
    if (action === "accept") {
      dateToUpdate.status = "accepted";
    } else if (action === "reject") {
      dateToUpdate.status = "rejected";
    } else {
      return res.status(400).json({ error: "Invalid action" });
    }

    // Save the updated pass document
    await pass.save();
    return res.json({
      success: true,
      message: `Date ${date} has been ${
        action === "accept" ? "accepted" : "rejected"
      }`,
      pass, // Return the updated pass data
    });
  } catch (error) {
    console.error("Error updating date status:", error);
    res.status(500).json({ error: error.message });
  }
};

const updatePassDetails = async (req, res) => {
  const { _id, type, quantity, } = req.body; 

  if (!_id || !type || !quantity  ) {
    return res.status(400).json({
      error: "Pass ID, type, quantity, and selectedDates are required",
    });
  }

  try {
    // Find the pass by ID and update the fields
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
      pass: updatedPass, // Return the updated pass data
    });
  } catch (error) {
    console.error("Error updating pass details:", error);
    res.status(500).json({ error: error.message });
  }
};

const sendMail = async (req, res) => {
  const { passes , email , _id , firstName, lastName} = req.body;

  try {
    const dummyLink = `http://192.168.29.219:3000/pass/${_id}`;
    const updatedPasses = passes.map(pass => ({
      ...pass,
      firstName: firstName,
      lastName: lastName
    }));
    
    for (const pass of updatedPasses) {
      const updatedPass = await Pass.findOneAndUpdate(
        { _id: pass._id },  // Match by the existing pass _id
        { $set: pass },    // Update the pass with the new data
        // { new: true, upsert: true }  // Create a new document if not found
      );
      if (!updatedPass) {
        console.error(`Error updating pass with _id ${pass._id}`);
      }
    }
    // Send email with passes and dummy link
    await sendEmail(email, passes, dummyLink , lastName, firstName);

    // Respond with success and dummy link
    res.status(200).json({ message: "Passes saved and email sent", passes: updatedPasses });
  } catch (error) {
    console.error("Error saving user or sending email:", error);
    res.status(400).json({ error: error.message, success: false });
  }
};

const getPass = async (req, res) => {
  const { id } = req.params;

  try {
  
    const pass = await Pass.findOne({ _id: id });

    if (!pass) {
      return res.status(400).json({ success: false, message: "Pass Not Found!" });
    }

    return res.status(200).json({ success: true, pass });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};


const handlePassAction = async (req, res) => {
  const { action, dateId } = req.body;  // Receive dateId and action from the request body

  // Log the dateId received

  try {
    if (!action || !dateId) {
      return res.status(400).json({ success: false, message: "Action or dateId missing." });
    }

    // Find the pass where the selectedDates array contains the given dateId
    const pass = await Pass.findOne({
      "selectedDates._id": dateId,  // Search within the selectedDates subdocument array
    });

    if (!pass) {
      return res.status(404).json({ success: false, message: "Pass with the specified dateId not found." });
    }

    // Find the specific date object within the selectedDates array by its ID
    const dateIndex = pass.selectedDates.findIndex((d) => d._id.toString() === dateId);

    if (dateIndex === -1) {
      return res.status(404).json({ success: false, message: "Date not found in selectedDates." });
    }

    // Update the status of the specific date object
    pass.selectedDates[dateIndex].status = action === 'accept' ? 'accepted' : 'rejected';

    // Save the updated pass
    await pass.save();

    return res.status(200).json({ success: true, message: `Pass date has been ${action}ed successfully.` });
  } catch (error) {
    console.error("Error processing pass action:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

const getAllPasses =async(req, res) =>{
  try {
  
    const passes = await Pass.find({ });

    if (!passes) {
      return res.status(400).json({ success: false, message: "Pass Not Found!" });
    }

    return res.status(200).json({ success: true, passes });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ success: false, error: error.message });
  }
}


module.exports = { Passes, updatePassStatus, updatePassDetails, sendMail, getPass, handlePassAction , getAllPasses};
