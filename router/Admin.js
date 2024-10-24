const express = require("express");
const { login, signup } = require("../controller/AdminController");


const router = express.Router();

// Sign-up route
router.post("/signup", signup);

// Login route
router.post("/login", login);

module.exports = router;
