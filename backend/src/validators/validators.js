const { z } = require("zod");

// ─────────────────────────────────────────────────────────────────────────────
//  AUTH VALIDATORS
// ─────────────────────────────────────────────────────────────────────────────

// POST /api/auth/user/register
const userRegisterSchema = z.object({
    fullname: z
        .string({ required_error: "Full name is required" })
        .min(2, "Full name must be at least 2 characters")
        .max(80, "Full name cannot exceed 80 characters")
        .trim(),

    email: z
        .string({ required_error: "Email is required" })
        .email("Please provide a valid email address")
        .lowercase()
        .trim(),

    password: z
        .string({ required_error: "Password is required" })
        .min(6, "Password must be at least 6 characters")
        .max(100, "Password cannot exceed 100 characters"),
});

// POST /api/auth/user/login
const userLoginSchema = z.object({
    email: z
        .string({ required_error: "Email is required" })
        .email("Please provide a valid email address")
        .lowercase()
        .trim(),

    password: z
        .string({ required_error: "Password is required" })
        .min(1, "Password is required"),
});

// POST /api/auth/foodpartner/register
const foodpartnerRegisterSchema = z.object({
    fullname: z
        .string({ required_error: "Restaurant name is required" })
        .min(2, "Restaurant name must be at least 2 characters")
        .max(100, "Restaurant name cannot exceed 100 characters")
        .trim(),

    contactName: z
        .string({ required_error: "Contact person name is required" })
        .min(2, "Contact name must be at least 2 characters")
        .max(80, "Contact name cannot exceed 80 characters")
        .trim(),

    phone: z
        .string({ required_error: "Phone number is required" })
        .min(7, "Phone number must be at least 7 digits")
        .max(15, "Phone number cannot exceed 15 digits")
        .regex(/^[0-9+\-\s()]+$/, "Phone number contains invalid characters"),

    address: z
        .string({ required_error: "Address is required" })
        .min(5, "Address must be at least 5 characters")
        .max(300, "Address cannot exceed 300 characters")
        .trim(),

    email: z
        .string({ required_error: "Email is required" })
        .email("Please provide a valid email address")
        .lowercase()
        .trim(),

    password: z
        .string({ required_error: "Password is required" })
        .min(6, "Password must be at least 6 characters")
        .max(100, "Password cannot exceed 100 characters"),
});

// POST /api/auth/foodpartner/login
const foodpartnerLoginSchema = z.object({
    email: z
        .string({ required_error: "Email is required" })
        .email("Please provide a valid email address")
        .lowercase()
        .trim(),

    password: z
        .string({ required_error: "Password is required" })
        .min(1, "Password is required"),
});

// ─────────────────────────────────────────────────────────────────────────────
//  FOOD VALIDATORS
// ─────────────────────────────────────────────────────────────────────────────

// POST /api/food/addItem  (text fields from multipart/form-data)
const addFoodItemSchema = z.object({
    foodname: z
        .string({ required_error: "Food name is required" })
        .min(2, "Food name must be at least 2 characters")
        .max(100, "Food name cannot exceed 100 characters")
        .trim(),

    description: z
        .string()
        .max(500, "Description cannot exceed 500 characters")
        .trim()
        .optional(),

    // Tags come as a comma-separated string from the form e.g. "spicy,vegan"
    tags: z
        .string()
        .max(200, "Tags string cannot exceed 200 characters")
        .optional(),
});

// POST /api/food/like  { foodId }
// POST /api/food/save  { foodId }
const foodIdSchema = z.object({
    foodId: z
        .string({ required_error: "foodId is required" })
        .length(24, "foodId must be a valid MongoDB ObjectId (24 characters)"),
});

// ─────────────────────────────────────────────────────────────────────────────
//  EXPORTS
// ─────────────────────────────────────────────────────────────────────────────
module.exports = {
    userRegisterSchema,
    userLoginSchema,
    foodpartnerRegisterSchema,
    foodpartnerLoginSchema,
    addFoodItemSchema,
    foodIdSchema,
};
