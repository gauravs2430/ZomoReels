const foodModel = require("../models/food.models");
const storageServices = require("../services/storage.services");
const { v4: uuid } = require("uuid");
const likeModel = require("../models/likes.models");
const saveModel = require("../models/save.models");



async function createFood(req, res) {

    if (!req.file) {
        return res.status(400).json({
            message: "Image file is required"
        });
    }

    const fileUploadResult = await storageServices.fileUpload(
        req.file.buffer,
        uuid()
    );

    let tagsArray = [];
    if (req.body.tags) {
        tagsArray = req.body.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
    }

    const foodItem = await foodModel.create({
        foodname: req.body.foodname,
        description: req.body.description,
        video: fileUploadResult.url,
        foodpartner: req.foodpartner._id,
        tags: tagsArray
    })

    return res.status(201).json({
        message: "Food created successfully",
        food: foodItem
    });
}

async function getFoodItem(req, res) {

    const foodItem = await foodModel.find({
    });

    return res.status(200).json({
        foodItem
    })

}

async function getFoodpartnerItems(req, res) {
    const foodpartner = req.foodpartner;
    const id = foodpartner._id;

    try {
        const videos = await foodModel.find({
            foodpartner: id
        });

        return res.status(200).json({
            foodpartner: foodpartner,
            videos
        })
    }
    catch (err) {
        return res.status(400).json({
            message: "Fetching failed"
        })
    }


}

async function getRestaurantById(req, res) {
    try {
        const { id } = req.params;
        const foodpartnerModel = require("../models/foodpartner.models");
        const partner = await foodpartnerModel.findById(id).select('-password');
        if (!partner) {
            return res.status(404).json({ message: "Restaurant not found" });
        }
        const videos = await foodModel.find({ foodpartner: id });
        return res.status(200).json({ foodpartner: partner, videos });
    } catch (err) {
        return res.status(400).json({ message: "Failed to load restaurant", error: err.message });
    }
}

async function likeFoodItem(req, res) {

    const { foodId } = req.body;
    const user = req.user;

    const isAlreadyLiked = await likeModel.findOne({
        user: user._id,
        food: foodId
    });

    if (isAlreadyLiked) {
        const unlike = await likeModel.deleteOne({
            user: user._id,
            food: foodId
        })
        await foodModel.findByIdAndUpdate(foodId, {
            $inc: { likeCount: -1 }
        })
        return res.status(200).json({
            message: "Food unliked successfully"
        })
    }
    else {
        const like = await likeModel.create({
            user: user._id,
            food: foodId
        })

        await foodModel.findByIdAndUpdate(foodId, {
            $inc: { likeCount: +1 }
        })

        return res.status(200).json({
            message: "Food liked successfully"
        });

    }

}

async function saveFoodItem(req, res) {

    const { foodId } = req.body;
    const user = req.user;

    const isAlreadySaved = await saveModel.findOne({
        user: user._id,
        food: foodId
    })

    if (isAlreadySaved) {

        const unSave = await saveModel.deleteOne({
            user: user._id,
            food: foodId
        })

        return res.status(200).json({
            message: "Food unsaved successfully"
        })

    }
    else {
        const save = await saveModel.create({
            user: user._id,
            food: foodId
        })

        return res.status(201).json({
            message: "Food saved successfully"
        })
    }
}

// GET /api/food/saved
// Returns all food reels bookmarked by the logged-in user
// Requires: authUserMiddleware (user JWT cookie)
async function getSavedItems(req, res) {
    try {
        const user = req.user;
        // Find all save records for this user, then populate the food details
        const saves = await saveModel
            .find({ user: user._id })
            .populate('food') // joins with foodModel to get full food doc
            .sort({ createdAt: -1 }); // newest saves first

        const savedFoods = saves.map(s => s.food).filter(Boolean);
        return res.status(200).json({ savedItems: savedFoods });
    } catch (err) {
        return res.status(400).json({ message: "Failed to fetch saved items", error: err.message });
    }
}

module.exports = {
    createFood,
    getFoodItem,
    getFoodpartnerItems,
    getRestaurantById,
    likeFoodItem,
    saveFoodItem,
    getSavedItems
}