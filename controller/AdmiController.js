
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../model/AdminModel");

exports.signup = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if the admin already exists
    let admin = await Admin.findOne({ email });
    if (admin) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    // Create a new admin
    admin = new Admin({ name, email, password });

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    admin.password = await bcrypt.hash(password, salt);

    // Save the admin to the database
    await admin.save();

    res.status(201).json({ message: "Admin created successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server error" });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the admin exists
    let admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Check if the password is correct
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Create and return JWT token (valid for 1 hour)
    const payload = { admin: { id: admin._id } };
    const token = jwt.sign(payload, "TESTTEST", {
      expiresIn: "1h",
    });

    res.status(200).json({ token });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server error" });
  }
};
