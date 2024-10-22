const AdminPass = require("../model/AdminPassModel");

const createPass = async (req, res) => {
  try {
    const { type, price, discount, discountType, isThreeDaysCombo } = req.body;
    const newPass = new AdminPass({
      type,
      price,
      discount: discount || 0, // Default to 0 if not provided
      discountType: discountType || 'percentage', // Default to percentage
      isThreeDaysCombo: isThreeDaysCombo || false, // Default to false
    });

    await newPass.save();
    res.status(201).json(newPass);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
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
      return res.status(404).json({ error: 'Pass not found' });
    }
    res.status(200).json(pass);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updatePass = async (req, res) => {
  try {
    const { type, price, discount, discountType, isThreeDaysCombo } = req.body;
    const updatedPass = await AdminPass.findByIdAndUpdate(
      req.params.id,
      { type, price, discount, discountType, isThreeDaysCombo },
      { new: true, runValidators: true }
    );

    if (!updatedPass) {
      return res.status(404).json({ error: 'Pass not found' });
    }
    res.status(200).json(updatedPass);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deletePass = async (req, res) => {
  try {
    const deletedPass = await AdminPass.findByIdAndDelete(req.params.id);
    if (!deletedPass) {
      return res.status(404).json({ error: 'Pass not found' });
    }
    res.status(200).json({ message: 'Pass deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createPass, getPass, getAllPasses, updatePass, deletePass };
