const express = require("express");
const foodControllers = require("../controllers/food.controllers");
const authMiddleware = require("../middlewares/authFP.middleware");
const multer = require("multer");

const upload = multer({
    storage: multer.memoryStorage(),
});


const router = express.Router();

// food route and controllers , This is a protected route.
router.post("/addItem", authMiddleware.authFoodPartnerMiddleware, upload.single("video"), foodControllers.createFood);

//secure route just like addItem but for a user not for foodpartner.
router.get('/getItem', authMiddleware.authUserMiddleware, foodControllers.getFoodItem);

//API TO GET ALL FOODPARTNER ITEMS 
router.get("/getFoodpartnerItems", authMiddleware.authFoodPartnerMiddleware, foodControllers.getFoodpartnerItems);

// PUBLIC: Get a restaurant's profile + reels by ID (no auth needed)
router.get("/restaurant/:id", foodControllers.getRestaurantById);

//Like food item
router.post("/like", authMiddleware.authUserMiddleware, foodControllers.likeFoodItem);

//save food 
router.post("/save" , authMiddleware.authUserMiddleware , foodControllers.saveFoodItem);


module.exports = router;