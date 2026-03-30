const foodModel = require("../models/food.models");
const foodpartnerModel = require("../models/foodpartner.models");

/**
 * GET /api/agent/recommendations
 *
 * Dedicated endpoint for the ZomoReels AI Voice Agent (Zomi).
 * The LLM calls this tool when a user expresses a food preference or craving.
 *
 * Query Parameters:
 * ─────────────────────────────────────────────────────────────────────────
 * @param {string}  craving    - Free-text keyword to search food names, tags,
 *                               and descriptions (e.g. "pizza", "spicy", "vegan")
 * @param {string}  tag        - Exact or partial tag match (e.g. "biryani", "dessert")
 * @param {string}  restaurant - Filter results to a specific restaurant name
 * @param {number}  minLikes   - Only include food items with at least this many likes
 *                               (e.g. 10 to get "popular" items)
 * @param {number}  limit      - Max number of results to return (default: 5, max: 10)
 *
 * How it works:
 * 1. We build a dynamic MongoDB query from whichever parameters the agent sends.
 * 2. If `craving` is provided, we search across foodname, description, AND tags.
 * 3. If `tag` is provided separately, it adds a precise tag filter.
 * 4. If `minLikes` is provided, only popular items are returned.
 * 5. Results are populated with the food partner (restaurant) name and address,
 *    so the agent can say "Try the Paneer Tikka at Spice Garden on MG Road."
 * 6. The response is a simplified JSON array — no DB internals, just what the
 *    LLM needs to speak a good recommendation aloud.
 */
module.exports.getFoodRecommendations = async (req, res) => {
    try {
        const { craving, tag, restaurant, minLikes, limit } = req.query;

        // Build the MongoDB filter object dynamically based on what the agent sends
        const andConditions = [];

        // 1. Free-text craving: search food name, description, and tags simultaneously
        if (craving) {
            andConditions.push({
                $or: [
                    { foodname:    { $regex: craving, $options: "i" } },
                    { description: { $regex: craving, $options: "i" } },
                    { tags:        { $in: [new RegExp(craving, "i")] } }
                ]
            });
        }

        // 2. Tag filter: narrow down by a specific cuisine/category tag
        if (tag) {
            andConditions.push({ tags: { $in: [new RegExp(tag, "i")] } });
        }

        // 3. Popularity filter: only return items with enough likes
        if (minLikes) {
            const min = parseInt(minLikes, 10);
            if (!isNaN(min)) {
                andConditions.push({ likeCount: { $gte: min } });
            }
        }

        // Combine all conditions with $and (if any), else return everything
        const foodQuery = andConditions.length > 0 ? { $and: andConditions } : {};

        // Cap the result limit between 1 and 10 for safety
        const resultLimit = Math.min(Math.max(parseInt(limit, 10) || 5, 1), 10);

        // 4. Fetch food items from DB, joining the food partner (restaurant) document
        let foodsQuery = foodModel
            .find(foodQuery)
            .populate("foodpartner", "fullname address")
            .sort({ likeCount: -1 }) // Return most-liked items first
            .limit(resultLimit);

        const foods = await foodsQuery;

        // 5. If a restaurant name filter was provided, filter results in-memory
        //    (after populate, since restaurant name lives on the joined document)
        const filtered = restaurant
            ? foods.filter(f =>
                f.foodpartner?.fullname
                    ?.toLowerCase()
                    .includes(restaurant.toLowerCase())
            )
            : foods;

        // 6. Shape the response into a clean, LLM-friendly format
        const recommendations = filtered.map(food => ({
            foodname:           food.foodname,
            restaurant:         food.foodpartner?.fullname    || "Unknown Restaurant",
            restaurantAddress:  food.foodpartner?.address     || "Address not available",
            description:        food.description              || "No description available",
            tags:               food.tags                     || [],
            likeCount:          food.likeCount                || 0
        }));

        // 7. If nothing matched, send a helpful empty response
        if (recommendations.length === 0) {
            return res.status(200).json({
                recommendations: [],
                message: "No food items found matching your request."
            });
        }

        return res.status(200).json({ recommendations });
    } catch (err) {
        return res.status(500).json({
            message: "Error fetching recommendations",
            error: err.message
        });
    }
};

/**
 * GET /api/agent/restaurants
 *
 * Dedicated endpoint for the AI Agent to fetch restaurant listings.
 * Called when a user asks "What restaurants are available?" or
 * "Show me restaurants near [area]."
 *
 * Query Parameters:
 * ─────────────────────────────────────────────────────────────────────────
 * @param {string} name    - Search restaurants by name
 * @param {string} address - Filter by area or locality keyword (e.g. "Bandra")
 * @param {number} limit   - Max results (default: 5)
 */
module.exports.getRestaurants = async (req, res) => {
    try {
        const { name, address, limit } = req.query;
        const andConditions = [];

        if (name) {
            andConditions.push({ fullname: { $regex: name, $options: "i" } });
        }

        if (address) {
            andConditions.push({ address: { $regex: address, $options: "i" } });
        }

        const query = andConditions.length > 0 ? { $and: andConditions } : {};
        const resultLimit = Math.min(Math.max(parseInt(limit, 10) || 5, 1), 10);

        const partners = await foodpartnerModel
            .find(query, "fullname address phone contactName image")
            .limit(resultLimit);

        if (partners.length === 0) {
            return res.status(200).json({
                restaurants: [],
                message: "No restaurants found matching your search."
            });
        }

        const restaurants = partners.map(p => ({
            name:         p.fullname,
            contactName:  p.contactName,
            address:      p.address,
            phone:        p.phone,
            hasAvatar:    !!p.image
        }));

        return res.status(200).json({ restaurants });
    } catch (err) {
        return res.status(500).json({
            message: "Error fetching restaurants",
            error: err.message
        });
    }
};
