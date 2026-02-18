const userModel = require("../models/user.models");
const foodpartnerModel = require("../models/foodpartner.models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");



async function registerUser(req, res) {
    const {
        fullname,
        email,
        password,
    } = req.body;

    const isUserExistAlready = await userModel.findOne({
        email
    });

    if (isUserExistAlready) {
        return res.status(400).json({
            message: "User Already Exists"
        });
    }

    const hashedPasswordUS = await bcrypt.hash(password, 10);

    const user = await userModel.create({
        fullname,
        email,
        password: hashedPasswordUS
    });

    const token = jwt.sign({
        id: user._id,
    }, process.env.JWT_SECRET);
    res.cookie("token", token);

    res.status(201).json({
        message: "User Registered sucessfully",
        user: {
            _id: user._id,
            email: user.email,
            fullname: user.fullname
        }
    });
}

async function loginUser(req, res) {

    const {
        email,
        password
    } = req.body;

    const user = await userModel.findOne({
        email
    });

    if (!user) {
        return res.status(400).json({
            message: "Invalid Email or password"
        })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        return res.status(400).json({
            message: "Invalid Email or password"
        })
    }

    const token = jwt.sign({
        id: user._id,
    }, process.env.JWT_SECRET)

    res.cookie("token", token);
    res.status(200).json({
        message: "User Logged In sucessfully",
        user: {
            id: user._id,
            fullname: user.fullname,
            email: user.email
        }
    })
}

function logoutUser(req, res) {
    res.clearCookie("token");
    res.status(200).json({
        message: "User logged out sucessfully"
    })
}

async function registerFoodpartner(req, res) {

    const {
        fullname,
        email,
        password,
        contactName,
        phone,
        address,

    } = req.body;

    const isFoodPartnerAlreadyExists = await foodpartnerModel.findOne({
        email
    })

    if (isFoodPartnerAlreadyExists) {
        return res.status(400).json({
            message: "Restaurant partner already exists"
        })
    }

    const hashedPasswordFP = await bcrypt.hash(password, 10);

    const foodpartner = await foodpartnerModel.create({
        fullname,
        contactName,
        phone,
        address,
        email,
        password: hashedPasswordFP
    });

    const token = jwt.sign({
        id: foodpartner._id,
    }, process.env.JWT_SECRET);
    res.cookie("token", token);


    res.status(201).json({
        message: "Foodpartner Registered sucessfully",
        foodpartner: {
            _id: foodpartner._id,
            fullname: foodpartner.fullname,
            contactName,
            phone,
            address,
            email: foodpartner.email
        }
    })
}

async function loginFoodpartner(req, res) {

    const {
        email,
        password
    } = req.body;

    const foodpartner = await foodpartnerModel.findOne({
        email
    })

    if (!foodpartner) {
        return res.status(400).json({
            message: "Invalid email or password"
        })
    }

    const isPassMatches = await bcrypt.compare(password, foodpartner.password)

    if (!isPassMatches) {
        return res.status(400).json({
            message: "Invalid Email or password"
        })
    }

    const token = jwt.sign(
        { id: foodpartner._id },
        process.env.JWT_SECRET
    );
    res.cookie("token", token);


    res.status(200).json({
        message: "User Logged In sucessfully",
        foodpartner: {
            id: foodpartner._id,
            fullname: foodpartner.fullname,
            email: foodpartner.email
        }
    })

}

function logoutFoodpartner(req, res) {
    res.clearCookie("token");
    res.status(200).json({
        message: "FoodPartner logged out sucessfully"
    })
}


module.exports = {
    registerUser,
    loginUser,
    logoutUser,

    registerFoodpartner,
    loginFoodpartner,
    logoutFoodpartner
}