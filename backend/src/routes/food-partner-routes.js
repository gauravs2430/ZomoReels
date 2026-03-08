const express = require("express");
const authFoodPartnerMiddleware = require("../middlewares/authFP.middleware");
const foodPartnerController = require("../controllers/food-partner.controller.js");


const router = express.Router();

router.post("/:id" , authFoodPartnerMiddleware.authFoodPartnerMiddleware , foodPartnerController.updateFoodPartner);

module.exports = router;
