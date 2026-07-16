import ApiError from "../utils/apiError.js";
import { ZodError } from "zod";

/**
 * Express middleware to validate request body using a Zod schema.
 * @param {import("zod").ZodSchema} schema - The Zod schema to validate against.
 */
export const validate = (schema) => (req, res, next) => {
  try {
    req.body = schema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof ZodError || error.name === "ZodError") {
      const issues = error.issues || error.errors;
      const message = issues
        ? issues.map((err) => err.message).join(" ")
        : error.message;
      return next(new ApiError(400, message));
    }
    next(error);
  }
};
