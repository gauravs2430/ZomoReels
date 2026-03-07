const foodModel = require("../models/food.models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const storageServices = require("../services/storage.services");
const { v4: uuid } = require("uuid");



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

module.exports = {
    createFood,
    getFoodItem,
    getFoodpartnerItems,
    getRestaurantById
}