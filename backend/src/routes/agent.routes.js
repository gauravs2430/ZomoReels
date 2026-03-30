const express = require("express");
const router = express.Router();
const agentController = require("../controllers/agent.controllers");

// Public routes specifically designed for the ZomoReels AI Voice Agent (Zomi)
router.get("/recommendations", agentController.getFoodRecommendations);
router.get("/restaurants",     agentController.getRestaurants);

module.exports = router;
