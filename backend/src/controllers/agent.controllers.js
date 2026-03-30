const foodModel = require("../models/food.models");

module.exports.getFoodRecommendations = async (req, res) => {
    try {
        const { craving } = req.query;
        let query = {};
        
        if (craving) {
            query = {
                $or: [
                    { foodname: { $regex: craving, $options: "i" } },
                    { tags: { $in: [new RegExp(craving, "i")] } },
                    { description: { $regex: craving, $options: "i" } }
                ]
            };
        }

        // Fetch up to 5 recommendations, populating the restaurant name
        const foods = await foodModel.find(query)
            .populate("foodpartner", "fullname address")
            .limit(5);

        // Map the results to a simplified format for the LLM to read easily
        const recommendations = foods.map(food => ({
            foodname: food.foodname,
            restaurant: food.foodpartner?.fullname || "Unknown",
            restaurantAddress: food.foodpartner?.address || "Unknown",
            description: food.description,
            likeCount: food.likeCount
        }));

        return res.status(200).json({ recommendations });
    } catch (err) {
        return res.status(500).json({ message: "Error fetching recommendations", error: err.message });
    }
};
