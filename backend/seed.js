/**
 * seed.js — ZomoReels Demo Data Seeder
 * 
 * Uploads 4 demo videos from the "food-view videos" folder to ImageKit,
 * creates a demo food-partner in MongoDB, and seeds 4 food reel documents.
 * 
 * Usage: node backend/seed.js
 *        (run from the root of the monorepo)
 */

require("dotenv").config({ path: __dirname + "/.env" });

const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const ImageKit = require("imagekit");
const { v4: uuid } = require("uuid");

// ── Models ────────────────────────────────────────────────────────────────────
const foodpartnerModel = require("./src/models/foodpartner.models");
const foodModel = require("./src/models/food.models");

// ── ImageKit ──────────────────────────────────────────────────────────────────
const imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

// ── Demo videos metadata ──────────────────────────────────────────────────────
const VIDEOS_DIR = path.join(__dirname, "../food-view videos");

const DEMO_REELS = [
    {
        filename: "15027198_2160_3840_30fps.mp4",
        foodname: "Sizzling BBQ Platter 🔥",
        description:
            "A mouth-watering BBQ spread featuring slow-smoked ribs, charred corn, and crispy golden fries drizzled with house special sauce. Perfect for sharing!",
        tags: ["bbq", "grill", "ribs", "popular"],
    },
    {
        filename: "5269551-uhd_2160_3840_24fps.mp4",
        foodname: "Gourmet Burger Stack 🍔",
        description:
            "Double-patty wagyu beef burger stacked with caramelised onions, aged cheddar, fresh lettuce, and our secret smoky mayo on a toasted brioche bun.",
        tags: ["burger", "wagyu", "gourmet", "trending"],
    },
    {
        filename: "8448308-hd_1080_1920_24fps.mp4",
        foodname: "Creamy Pasta Delight 🍝",
        description:
            "Al-dente tagliatelle tossed in a rich truffle cream sauce, topped with freshly grated Parmesan and crispy pancetta. A 5-star experience at home.",
        tags: ["pasta", "italian", "truffle", "creamy"],
    },
    {
        filename: "9484988-uhd_2160_3840_25fps.mp4",
        foodname: "Artisan Dessert Bowl 🍨",
        description:
            "A decadent dessert bowl of warm Belgian chocolate lava cake served alongside vanilla bean gelato and a berry coulis drizzle. Pure indulgence!",
        tags: ["dessert", "chocolate", "gelato", "indulgent"],
    },
];

// ── Demo Food Partner ─────────────────────────────────────────────────────────
const DEMO_PARTNER = {
    fullname: "ZomoReels Kitchen",
    contactName: "Chef Gaurav",
    phone: "+91-9876543210",
    address: "12, Foodie Lane, Bengaluru, Karnataka – 560001",
    email: "demo@zomoreels.kitchen",
    password: "Demo@1234",
};

// ── Helpers ───────────────────────────────────────────────────────────────────
async function uploadVideo(filePath, name) {
    console.log(`  ⬆️  Uploading "${name}" to ImageKit…`);
    const buffer = fs.readFileSync(filePath);
    const result = await imagekit.upload({
        file: buffer.toString("base64"),
        fileName: uuid() + ".mp4",
        folder: "/zomoreels/demo",
    });
    console.log(`  ✅  Uploaded → ${result.url}`);
    return result.url;
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function seed() {
    console.log("\n🌱  ZomoReels Seeder Starting…\n");

    // 1. Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_CONNECTION);
    console.log("✅  MongoDB connected\n");

    // 2. Create (or reuse) the demo food partner
    let partner = await foodpartnerModel.findOne({ email: DEMO_PARTNER.email });
    if (partner) {
        console.log(`♻️  Demo food partner already exists (${partner._id}). Reusing.\n`);
    } else {
        const hashed = await bcrypt.hash(DEMO_PARTNER.password, 10);
        partner = await foodpartnerModel.create({ ...DEMO_PARTNER, password: hashed });
        console.log(`✅  Demo food partner created (${partner._id})\n`);
    }

    // 3. Upload each video & create food reel documents
    for (const reel of DEMO_REELS) {
        const filePath = path.join(VIDEOS_DIR, reel.filename);

        // Skip if video file doesn't exist on disk
        if (!fs.existsSync(filePath)) {
            console.warn(`⚠️  File not found, skipping: ${filePath}`);
            continue;
        }

        // Skip if a reel with this exact foodname already exists for this partner
        const exists = await foodModel.findOne({ foodname: reel.foodname, foodpartner: partner._id });
        if (exists) {
            console.log(`♻️  Reel "${reel.foodname}" already seeded. Skipping upload.\n`);
            continue;
        }

        const videoUrl = await uploadVideo(filePath, reel.foodname);

        const doc = await foodModel.create({
            foodname: reel.foodname,
            description: reel.description,
            video: videoUrl,
            foodpartner: partner._id,
            tags: reel.tags,
            likeCount: Math.floor(Math.random() * 8000) + 500, // realistic seed count
        });

        console.log(`  🎬  Reel saved → "${doc.foodname}" (${doc._id})\n`);
    }

    console.log("🎉  Seeding complete!\n");
    console.log("─────────────────────────────────────────────────────");
    console.log("Demo Food Partner credentials (for food-partner login):");
    console.log(`  Email   : ${DEMO_PARTNER.email}`);
    console.log(`  Password: ${DEMO_PARTNER.password}`);
    console.log("─────────────────────────────────────────────────────\n");

    await mongoose.disconnect();
    process.exit(0);
}

seed().catch((err) => {
    console.error("❌  Seeder failed:", err.message);
    process.exit(1);
});
