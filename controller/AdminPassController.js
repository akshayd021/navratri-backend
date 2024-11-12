const AdminPass = require("../model/AdminPassModel");
const createPass = async (req, res) => {
  try {
    const {
      type,
      price,
      threeDaysPrice,
      fiveDaysPrice,
      seasonPrice,
      isThreeDaysCombo,
      isFiveDaysCombo,
      seasonPass,
      maxQuantity,
    } = req.body;

    const newPass = new AdminPass({
      type,
      price,
      threeDaysPrice,
      fiveDaysPrice,
      seasonPrice,
      isThreeDaysCombo,
      isFiveDaysCombo,
      seasonPass,
      maxQuantity,
      isSoldOut: maxQuantity === 0, // Set initial isSoldOut based on maxQuantity
    });

    await newPass.save();
    res.status(201).json(newPass);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updatePass = async (req, res) => {
  try {
    const {
      type,
      price,
      threeDaysPrice,
      fiveDaysPrice,
      seasonPrice,
      isThreeDaysCombo,
      isFiveDaysCombo,
      seasonPass,
      maxQuantity,
    } = req.body;

    const updatedPass = await AdminPass.findByIdAndUpdate(
      req.params.id,
      {
        type,
        price,
        threeDaysPrice,
        fiveDaysPrice,
        seasonPrice,
        isThreeDaysCombo,
        isFiveDaysCombo,
        seasonPass,
        maxQuantity,
        isSoldOut: maxQuantity === 0, // Update isSoldOut based on maxQuantity
      },
      { new: true, runValidators: true }
    );

    if (!updatedPass) {
      return res.status(404).json({ error: "Pass not found" });
    }
    res.status(200).json(updatedPass);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const checkPassAvailability = async (passId, requestedQuantity) => {
  const pass = await AdminPass.findById(passId);

  if (!pass) return false;

  // Check if requested quantity exceeds the allowed maxQuantity
  if (pass.currentQuantity + requestedQuantity > pass.maxQuantity) {
    return false;
  }

  // Update current quantity and set isSoldOut if the limit is reached
  pass.currentQuantity += requestedQuantity;
  if (pass.currentQuantity >= pass.maxQuantity) {
    pass.isSoldout = true;
  }
  await pass.save();

  return true;
};


const getAllPasses = async (req, res) => {
  try {
    const passes = await AdminPass.find();
    res.status(200).json(passes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getPass = async (req, res) => {
  try {
    const pass = await AdminPass.findById(req.params.id);
    if (!pass) {
      return res.status(404).json({ error: "Pass not found" });
    }
    res.status(200).json(pass);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deletePass = async (req, res) => {
  try {
    const deletedPass = await AdminPass.findByIdAndDelete(req.params.id);
    if (!deletedPass) {
      return res.status(404).json({ error: "Pass not found" });
    }
    res.status(200).json({ message: "Pass deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createPass, getPass, getAllPasses, updatePass, deletePass };
