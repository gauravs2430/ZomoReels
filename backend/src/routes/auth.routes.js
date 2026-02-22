const express = require("express");
const authController = require("../controllers/auth.controllers");


const router = express.Router();

//user auth APIs 
router.post("/user/register", authController.registerUser);
router.post("/user/login", authController.loginUser);
router.get("/user/logout", authController.logoutUser);


//foodpartner auth APIs
router.post("/foodpartner/register", authController.registerFoodpartner);
router.post("/foodpartner/login", authController.loginFoodpartner);
router.get("/foodpartner/logout", authController.logoutFoodpartner);
router.get("/foodpartners", authController.getAllFoodpartners);

module.exports = router;
