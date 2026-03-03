const express = require("express");
const authController = require("../controllers/auth.controllers");
const authMiddleware = require("../middlewares/authFP.middleware");
const multer = require("multer");

const upload = multer({
    storage: multer.memoryStorage(),
});

const router = express.Router();

//user auth APIs 
router.post("/user/register", authController.registerUser);
router.post("/user/login", authController.loginUser);
router.get("/user/logout", authController.logoutUser);


//foodpartner auth APIs
router.post("/foodpartner/register", authController.registerFoodpartner);
router.post("/foodpartner/login", authController.loginFoodpartner);
router.get("/foodpartner/logout", authController.logoutFoodpartner);
router.post("/foodpartner/image", authMiddleware.authFoodPartnerMiddleware, upload.single("image"), authController.updateFoodpartnerImage);
router.get("/foodpartners", authController.getAllFoodpartners);

module.exports = router;
