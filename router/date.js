const express = require('express');
const { createDate, getAllDates, getDateById, updateDateById, deleteDateById } = require('../controller/dateController');


const router = express.Router();

router.post('/create-date', createDate);

router.get("/dates", getAllDates);

router.get("/dates/:id", getDateById);

router.put("/dates/:id", updateDateById);

router.delete("/dates/:id", deleteDateById);

module.exports = router;
