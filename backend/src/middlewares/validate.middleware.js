const { ZodError } = require("zod");

/**
 * validate(schema)
 * ─────────────────────────────────────────────────────────────
 * A factory function that returns an Express middleware.
 *
 * Usage in a route file:
 *   const { validate } = require("../middlewares/validate.middleware");
 *   const { userRegisterSchema } = require("../validators/validators");
 *
 *   router.post("/user/register", validate(userRegisterSchema), authController.registerUser);
 *
 * What it does:
 *  1. Parses req.body against the given Zod schema using .safeParse()
 *  2. If validation PASSES → attaches the cleaned/coerced data back to
 *     req.body (so the controller always gets sanitized data) and calls next()
 *  3. If validation FAILS → responds with 400 and a structured errors array
 *     so the frontend knows exactly which field failed and why
 *
 * Error response shape:
 *  {
 *    "message": "Validation failed",
 *    "errors": [
 *      { "field": "email", "message": "Please provide a valid email address" },
 *      { "field": "password", "message": "Password must be at least 6 characters" }
 *    ]
 *  }
 *
 * Why safeParse instead of parse?
 *  .parse() throws an exception — we'd need try/catch everywhere.
 *  .safeParse() returns { success, data, error } — cleaner and explicit.
 */
function validate(schema) {
    return (req, res, next) => {
        const result = schema.safeParse(req.body);

        if (!result.success) {
            // ZodError.issues is an array of all field-level failures
            const errors = result.error.issues.map((issue) => ({
                field: issue.path.join("."),  // e.g. "email", "address"
                message: issue.message,       // e.g. "Please provide a valid email"
            }));

            return res.status(400).json({
                message: "Validation failed",
                errors,
            });
        }

        // Replace req.body with the cleaned, coerced values from Zod
        // (e.g. email is now lowercased and trimmed, even if user typed "  JOHN@GMAIL.COM  ")
        req.body = result.data;
        next();
    };
}

module.exports = { validate };
