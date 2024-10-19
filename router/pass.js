const express = require('express');
const { Passes, updatePassStatus, updatePassDetails, sendMail, getPass, handlePassAction, getAllPasses } = require('../controller/passController');

const router = express.Router();

router.post('/passes', Passes); // Create a new pass
router.get('/get-pass/:id', getPass); 
router.post("/pass/pass-status", updatePassStatus);
router.put("/pass/update-pass", updatePassDetails);
router.post('/pass/send-mail', sendMail)
router.post("/pass/update-action", handlePassAction)
router.get("/pass/get-passes", getAllPasses)

// router.get('/get-pass/:id', getPass);

module.exports = router;
