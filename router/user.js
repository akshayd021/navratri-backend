const express = require('express');

const { Login, user, getUsers, verifyLink, sendPaymentLink } = require('../controller/userController');

const router = express.Router();

router.post('/send-link', user);
router.get('/get-users', getUsers);
router.post("/verify-link", verifyLink);
// router.post('/send-email', sendPaymentLink)

// router.post('/send-email', Login);

module.exports = router;
