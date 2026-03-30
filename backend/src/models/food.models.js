const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema({
    foodname: {
        type: String,
        required: true
    },
    video: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    foodpartner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "foodpartner"
    },
    tags: {
        type: [String],
        default: []
    },
    likeCount: {
        type: Number ,
        default: 0
    }

}, { timestamps: true });

const foodModel = mongoose.model("foodModel", foodSchema);

module.exports = foodModel;