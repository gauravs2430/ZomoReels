const mongoose = require("mongoose");

const likeSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    // Field renamed from 'video' → 'food' to match the likeFoodItem controller
    // which uses { user, food: foodId } in all findOne/create/deleteOne calls
    food: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "foodModel",
        required: true
    }

}, {
    timestamps: true
});

const Like = mongoose.model("like", likeSchema);

module.exports = Like;
