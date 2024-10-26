// routes/promo.js
const express = require("express");
const { CreatePromo, getAllPromo, updatePromo, DeletePromo, ApplyPromo } = require("../controller/PromoController");

const router = express.Router();

router.post("/",CreatePromo);
  
  router.get("/",getAllPromo );
  
  router.put("/:id",updatePromo);
  
  router.delete("/:id",DeletePromo);

  router.post('/apply', ApplyPromo)
  

module.exports = router;
