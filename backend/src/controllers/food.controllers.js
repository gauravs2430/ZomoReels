const foodModel = require("../models/food.models");
const storageServices = require("../services/storage.services");
const { v4: uuid } = require("uuid");
const likeModel = require("../models/likes.models");
const saveModel = require("../models/save.models");
const foodpartnerModel = require("../models/foodpartner.models");


// ─────────────────────────────────────────────────────────────────────────────
//  createFood
//  POST /api/food/addItem
//  Auth: Food Partner JWT cookie
//  Uploads a video reel to ImageKit and saves the food item to MongoDB.
// ─────────────────────────────────────────────────────────────────────────────
async function createFood(req, res) {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "Video file is required" });
        }

        const fileUploadResult = await storageServices.fileUpload(req.file.buffer, uuid());

        const tagsArray = req.body.tags
            ? req.body.tags.split(",").map(t => t.trim()).filter(Boolean)
            : [];

        const foodItem = await foodModel.create({
            foodname: req.body.foodname,
            description: req.body.description,
            video: fileUploadResult.url,
            foodpartner: req.foodpartner._id,
            tags: tagsArray,
        });

        return res.status(201).json({
            message: "Food reel created successfully",
            food: foodItem,
        });
    } catch (err) {
        console.error("createFood error:", err.message);
        return res.status(500).json({ message: "Failed to create food item" });
    }
}


// ─────────────────────────────────────────────────────────────────────────────
//  getFoodItem
//  GET /api/food/getItem
//  Auth: User JWT cookie
//  Returns all food reels for the user's home feed.
// ─────────────────────────────────────────────────────────────────────────────
async function getFoodItem(req, res) {
    try {
        const foodItem = await foodModel.find({});
        return res.status(200).json({ foodItem });
    } catch (err) {
        console.error("getFoodItem error:", err.message);
        return res.status(500).json({ message: "Failed to fetch food items" });
    }
}


// ─────────────────────────────────────────────────────────────────────────────
//  getFoodpartnerItems
//  GET /api/food/getFoodpartnerItems
//  Auth: Food Partner JWT cookie
//  Returns only the logged-in food partner's uploaded reels.
// ─────────────────────────────────────────────────────────────────────────────
async function getFoodpartnerItems(req, res) {
    try {
        const { _id } = req.foodpartner;
        const videos = await foodModel.find({ foodpartner: _id });
        return res.status(200).json({ foodpartner: req.foodpartner, videos });
    } catch (err) {
        console.error("getFoodpartnerItems error:", err.message);
        return res.status(500).json({ message: "Failed to fetch partner reels" });
    }
}


// ─────────────────────────────────────────────────────────────────────────────
//  getRestaurantById
//  GET /api/food/restaurant/:id
//  Public — no auth required
//  Returns a restaurant's profile + all their food reels. Used by RestaurantProfile page.
// ─────────────────────────────────────────────────────────────────────────────
async function getRestaurantById(req, res) {
    try {
        const { id } = req.params;
        const partner = await foodpartnerModel.findById(id).select("-password");
        if (!partner) {
            return res.status(404).json({ message: "Restaurant not found" });
        }
        const videos = await foodModel.find({ foodpartner: id });
        return res.status(200).json({ foodpartner: partner, videos });
    } catch (err) {
        console.error("getRestaurantById error:", err.message);
        return res.status(500).json({ message: "Failed to load restaurant profile" });
    }
}


// ─────────────────────────────────────────────────────────────────────────────
//  likeFoodItem
//  POST /api/food/like  { foodId }
//  Auth: User JWT cookie
//  Toggles like/unlike on a reel. Updates likeCount on the food document.
// ─────────────────────────────────────────────────────────────────────────────
async function likeFoodItem(req, res) {
    try {
        const { foodId } = req.body;
        const userId = req.user._id;

        const existing = await likeModel.findOne({ user: userId, food: foodId });

        if (existing) {
            // Already liked → unlike
            await likeModel.deleteOne({ user: userId, food: foodId });
            await foodModel.findByIdAndUpdate(foodId, { $inc: { likeCount: -1 } });
            return res.status(200).json({ message: "Food unliked successfully" });
        } else {
            // Not liked yet → like
            await likeModel.create({ user: userId, food: foodId });
            await foodModel.findByIdAndUpdate(foodId, { $inc: { likeCount: 1 } });
            return res.status(200).json({ message: "Food liked successfully" });
        }
    } catch (err) {
        console.error("likeFoodItem error:", err.message);
        return res.status(500).json({ message: "Failed to process like" });
    }
}


// ─────────────────────────────────────────────────────────────────────────────
//  saveFoodItem
//  POST /api/food/save  { foodId }
//  Auth: User JWT cookie
//  Toggles save/unsave (bookmark) on a reel.
// ─────────────────────────────────────────────────────────────────────────────
async function saveFoodItem(req, res) {
    try {
        const { foodId } = req.body;
        const userId = req.user._id;

        const existing = await saveModel.findOne({ user: userId, food: foodId });

        if (existing) {
            // Already saved → unsave
            await saveModel.deleteOne({ user: userId, food: foodId });
            return res.status(200).json({ message: "Food unsaved successfully" });
        } else {
            // Not saved → save
            await saveModel.create({ user: userId, food: foodId });
            return res.status(201).json({ message: "Food saved successfully" });
        }
    } catch (err) {
        console.error("saveFoodItem error:", err.message);
        return res.status(500).json({ message: "Failed to process save" });
    }
}


// ─────────────────────────────────────────────────────────────────────────────
//  getSavedItems
//  GET /api/food/saved
//  Auth: User JWT cookie
//  Returns all food reels bookmarked by the logged-in user, newest first.
// ─────────────────────────────────────────────────────────────────────────────
async function getSavedItems(req, res) {
    try {
        const saves = await saveModel
            .find({ user: req.user._id })
            .populate("food")           // joins save doc with full food document
            .sort({ createdAt: -1 });   // newest saves first

        const savedFoods = saves.map(s => s.food).filter(Boolean);
        return res.status(200).json({ savedItems: savedFoods });
    } catch (err) {
        console.error("getSavedItems error:", err.message);
        return res.status(500).json({ message: "Failed to fetch saved items" });
    }
}


module.exports = {
    createFood,
    getFoodItem,
    getFoodpartnerItems,
    getRestaurantById,
    likeFoodItem,
    saveFoodItem,
    getSavedItems,
};