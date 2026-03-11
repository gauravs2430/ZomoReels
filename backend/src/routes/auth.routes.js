const express = require("express");
const authController = require("../controllers/auth.controllers");
const authMiddleware = require("../middlewares/authFP.middleware");
const { validate } = require("../middlewares/validate.middleware");
const {
    userRegisterSchema,
    userLoginSchema,
    foodpartnerRegisterSchema,
    foodpartnerLoginSchema,
} = require("../validators/validators");
const multer = require("multer");

const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router();

// ── User Auth ─────────────────────────────────────────────────────────────────
// validate(schema) runs BEFORE the controller.
// If the body fails, it sends a 400 with field-level errors immediately.
// If it passes, the controller receives clean, sanitized req.body.

router.post("/user/register", validate(userRegisterSchema), authController.registerUser);
router.post("/user/login", validate(userLoginSchema), authController.loginUser);
router.get("/user/logout", authController.logoutUser);
router.get("/user/me", authMiddleware.authUserMiddleware, authController.getUserMe);

// ── Food Partner Auth ─────────────────────────────────────────────────────────
router.post("/foodpartner/register", validate(foodpartnerRegisterSchema), authController.registerFoodpartner);
router.post("/foodpartner/login", validate(foodpartnerLoginSchema), authController.loginFoodpartner);
router.get("/foodpartner/logout", authController.logoutFoodpartner);

// Image upload uses multipart/form-data — Multer parses it, no JSON body to validate
router.post("/foodpartner/image",
    authMiddleware.authFoodPartnerMiddleware,
    upload.single("image"),
    authController.updateFoodpartnerImage
);

router.get("/foodpartners", authController.getAllFoodpartners);

module.exports = router;
