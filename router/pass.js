const express = require('express');
const { Passes, getPass, getPasses } = require('../controller/passController');

const router = express.Router();

router.post('/passes', Passes); // Create a new pass
router.get('/get-passes', getPasses); 
router.get('/get-pass/:id', getPass);

module.exports = router;
