const foodpartnerModel = require("../models/foodpartner.models");
const userModel = require('../models/user.models')
const jwt = require("jsonwebtoken");


async function authFoodPartnerMiddleware(req, res, next) {

    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({
            message: "Please Login first !!"
        });
    };

    try {
        const data = jwt.verify(token, process.env.JWT_SECRET);
        const foodpartner = await foodpartnerModel.findById(data.id);
        req.foodpartner = foodpartner;
        next();
    }

    catch (err) {
        return res.status(400).json({
            message: "Invalid token"
        });
    }
}

async function authUserMiddleware(req, res, next) {

    const token = req.cookies.token;

    if (!token) {
        return res.status(400).json({
            message: "Please login first"
        })
    }

    try {
        const data = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(data.id);

        req.user = user;
        next();
    }
    catch (err) {
        return res.status(400).json({
            message: "Invalid token"
        });
    }

}


module.exports = {
    authFoodPartnerMiddleware,
    authUserMiddleware
}
