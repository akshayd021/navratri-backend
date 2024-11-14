// routes/promo.js
const express = require("express");
const { sendMessage } = require("../controller/MessageController");

const router = express.Router();

router.post("/send-message", sendMessage);

module.exports = router;
