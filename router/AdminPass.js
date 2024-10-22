const express = require('express');
const { createPass, getPass, getAllPasses, updatePass, deletePass } = require('../controller/AdminPassController');

const router = express.Router();

router.post('/create-pass', createPass); // Create a new pass
router.get('/get-pass/:id', getPass); 
router.get('/get-passes', getAllPasses); 
router.put("/update-pass/:id", updatePass);
router.delete("/delete-pass/:id", deletePass)


module.exports = router;
