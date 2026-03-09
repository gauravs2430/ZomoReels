const mongoose = require("mongoose");

const saveSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    food: {
        type: mongoose.Schema.Types.ObjectId,
        // Must match the model name in food.models.js: mongoose.model("foodModel", ...)
        ref: "foodModel",
        required: true
    }
}, {
    timestamps: true
});

const saveModel = mongoose.model("save", saveSchema);
module.exports = saveModel; 