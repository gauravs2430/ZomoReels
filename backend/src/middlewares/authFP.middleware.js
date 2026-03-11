const foodpartnerModel = require("../models/foodpartner.models");
const userModel = require("../models/user.models");
const jwt = require("jsonwebtoken");

// ─────────────────────────────────────────────────────────────────────────────
//  authFoodPartnerMiddleware
//  Protects food partner routes (e.g. upload reel, view own reels).
//  1. Reads the JWT from the 'token' HttpOnly cookie
//  2. Verifies it — handles two distinct failure cases:
//       - TokenExpiredError → clears the stale cookie, returns 401 "Session expired"
//       - Other errors     → returns 401 "Invalid session"
//  3. On success → attaches full foodpartner document to req.foodpartner
// ─────────────────────────────────────────────────────────────────────────────
async function authFoodPartnerMiddleware(req, res, next) {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: "Please login first" });
    }

    try {
        const data = jwt.verify(token, process.env.JWT_SECRET);
        const foodpartner = await foodpartnerModel.findById(data.id);

        if (!foodpartner) {
            return res.status(401).json({ message: "Account not found" });
        }

        req.foodpartner = foodpartner;
        next();
    } catch (err) {
        if (err.name === "TokenExpiredError") {
            // JWT has passed its expiresIn duration — clear the dead cookie
            // so the browser doesn't keep sending it on future requests
            res.clearCookie("token");
            return res.status(401).json({ message: "Session expired. Please login again." });
        }
        return res.status(401).json({ message: "Invalid session. Please login again." });
    }
}

// ─────────────────────────────────────────────────────────────────────────────
//  authUserMiddleware
//  Protects user routes (e.g. view reel feed, like, save).
//  Same pattern as above but looks up the 'user' collection instead.
// ─────────────────────────────────────────────────────────────────────────────
async function authUserMiddleware(req, res, next) {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: "Please login first" });
    }

    try {
        const data = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(data.id);

        if (!user) {
            return res.status(401).json({ message: "Account not found" });
        }

        req.user = user;
        next();
    } catch (err) {
        if (err.name === "TokenExpiredError") {
            // Clear the expired cookie — user must log in again
            res.clearCookie("token");
            return res.status(401).json({ message: "Session expired. Please login again." });
        }
        return res.status(401).json({ message: "Invalid session. Please login again." });
    }
}

module.exports = {
    authFoodPartnerMiddleware,
    authUserMiddleware,
};
