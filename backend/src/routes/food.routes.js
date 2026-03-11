const express = require("express");
const foodControllers = require("../controllers/food.controllers");
const authMiddleware = require("../middlewares/authFP.middleware");
const { validate } = require("../middlewares/validate.middleware");
const { addFoodItemSchema, foodIdSchema } = require("../validators/validators");
const multer = require("multer");

const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router();

// ── Food Partner Routes ───────────────────────────────────────────────────────

// POST /addItem — multipart/form-data (video file + text fields)
// Multer parses the form first, THEN validate checks the text fields (req.body)
router.post("/addItem",
    authMiddleware.authFoodPartnerMiddleware,
    upload.single("video"),
    validate(addFoodItemSchema),       // validates foodname, description, tags from body
    foodControllers.createFood
);

// ── User Reel Routes ──────────────────────────────────────────────────────────

// GET routes — no body to validate
router.get("/getItem", authMiddleware.authUserMiddleware, foodControllers.getFoodItem);
router.get("/getFoodpartnerItems", authMiddleware.authFoodPartnerMiddleware, foodControllers.getFoodpartnerItems);
router.get("/saved", authMiddleware.authUserMiddleware, foodControllers.getSavedItems);

// PUBLIC — no auth, no body
router.get("/restaurant/:id", foodControllers.getRestaurantById);

// ── Like / Save — both expect { foodId } in the body ─────────────────────────
router.post("/like",
    authMiddleware.authUserMiddleware,
    validate(foodIdSchema),            // validates { foodId } is a 24-char string
    foodControllers.likeFoodItem
);

router.post("/save",
    authMiddleware.authUserMiddleware,
    validate(foodIdSchema),            // same schema — same shape of body
    foodControllers.saveFoodItem
);

module.exports = router;