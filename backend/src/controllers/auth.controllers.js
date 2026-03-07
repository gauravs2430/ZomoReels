const userModel = require("../models/user.models");
const foodpartnerModel = require("../models/foodpartner.models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const storageServices = require("../services/storage.services");
const { v4: uuid } = require("uuid");



async function registerUser(req, res) {
    try {
        const { fullname, email, password } = req.body;

        const isUserExistAlready = await userModel.findOne({ email });
        if (isUserExistAlready) {
            return res.status(400).json({ message: "User Already Exists" });
        }

        const hashedPasswordUS = await bcrypt.hash(password, 10);
        const user = await userModel.create({ fullname, email, password: hashedPasswordUS });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.cookie("token", token, { httpOnly: true });

        res.status(201).json({
            message: "User Registered sucessfully",
            user: { _id: user._id, email: user.email, fullname: user.fullname }
        });
    } catch (err) {
        console.error("registerUser error:", err.message);
        res.status(500).json({ message: "Server error: " + err.message });
    }
}

async function loginUser(req, res) {
    try {
        const { email, password } = req.body;

        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid Email or password" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid Email or password" });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.cookie("token", token, { httpOnly: true });

        res.status(200).json({
            message: "User Logged In sucessfully",
            user: { id: user._id, fullname: user.fullname, email: user.email }
        });
    } catch (err) {
        console.error("loginUser error:", err.message);
        res.status(500).json({ message: "Server error: " + err.message });
    }
}

function logoutUser(req, res) {
    res.clearCookie("token");
    res.status(200).json({
        message: "User logged out sucessfully"
    })
}

async function registerFoodpartner(req, res) {
    try {
        const { fullname, email, password, contactName, phone, address } = req.body;

        const isFoodPartnerAlreadyExists = await foodpartnerModel.findOne({ email });
        if (isFoodPartnerAlreadyExists) {
            return res.status(400).json({ message: "Restaurant partner already exists" });
        }

        const hashedPasswordFP = await bcrypt.hash(password, 10);
        const foodpartner = await foodpartnerModel.create({
            fullname, contactName, phone, address, email, password: hashedPasswordFP
        });

        const token = jwt.sign({ id: foodpartner._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.cookie("token", token, { httpOnly: true });

        res.status(201).json({
            message: "Foodpartner Registered sucessfully",
            foodpartner: { _id: foodpartner._id, fullname: foodpartner.fullname, contactName, phone, address, email: foodpartner.email }
        });
    } catch (err) {
        console.error("registerFoodpartner error:", err.message);
        res.status(500).json({ message: "Server error: " + err.message });
    }
}

async function loginFoodpartner(req, res) {
    try {
        const { email, password } = req.body;

        const foodpartner = await foodpartnerModel.findOne({ email });
        if (!foodpartner) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const isPassMatches = await bcrypt.compare(password, foodpartner.password);
        if (!isPassMatches) {
            return res.status(400).json({ message: "Invalid Email or password" });
        }

        const token = jwt.sign({ id: foodpartner._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.cookie("token", token, { httpOnly: true });

        res.status(200).json({
            message: "User Logged In sucessfully",
            foodpartner: { id: foodpartner._id, fullname: foodpartner.fullname, email: foodpartner.email }
        });
    } catch (err) {
        console.error("loginFoodpartner error:", err.message);
        res.status(500).json({ message: "Server error: " + err.message });
    }
}

function logoutFoodpartner(req, res) {
    res.clearCookie("token");
    res.status(200).json({
        message: "FoodPartner logged out sucessfully"
    })
}

async function getAllFoodpartners(req, res) {
    try {
        const partners = await foodpartnerModel.find({}, 'fullname contactName phone address image');
        res.status(200).json({ partners });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch food partners" });
    }
}

async function updateFoodpartnerImage(req, res) {
    if (!req.file) {
        return res.status(400).json({ message: "Image file is required" });
    }

    try {
        const fileUploadResult = await storageServices.imageUpload(req.file.buffer, uuid());

        const updatedPartner = await foodpartnerModel.findByIdAndUpdate(
            req.foodpartner._id,
            { image: fileUploadResult.url },
            { new: true }
        );

        return res.status(200).json({
            message: "Image uploaded successfully",
            image: updatedPartner.image
        });
    } catch (error) {
        return res.status(500).json({ message: "Image upload failed: " + error.message });
    }
}

module.exports = {
    registerUser,
    loginUser,
    logoutUser,

    registerFoodpartner,
    loginFoodpartner,
    logoutFoodpartner,
    getAllFoodpartners,
    updateFoodpartnerImage
}