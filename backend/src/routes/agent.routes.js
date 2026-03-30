const express = require("express");
const router = express.Router();
const agentController = require("../controllers/agent.controllers");

// Public route specifically designed for the AI Agent
router.get("/recommendations", agentController.getFoodRecommendations);

module.exports = router;
