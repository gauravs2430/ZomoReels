const express = require("express");
const foodControllers = require("../controllers/food.controllers");
const authMiddleware = require("../middlewares/authFP.middleware");
const multer = require("multer");

const upload = multer({
    storage:multer.memoryStorage(),
});


const router = express.Router();

// food route and controllers , This is a protected route.
router.post("/addItem" , authMiddleware.authFoodPartnerMiddleware , upload.single("video"), foodControllers.createFood);

//secure route just like addItem but for a user not for foodpartner.
router.get('/getItem' , authMiddleware.authUserMiddleware , foodControllers.getFoodItem);

router.get("/getFoodpartnerItems" , authMiddleware.authFoodPartnerMiddleware , foodControllers.getFoodpartnerItems )


module.exports = router;