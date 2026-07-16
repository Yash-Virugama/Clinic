import dotenv from "dotenv";
import bcrypt from "bcryptjs";

import connectDB from "../config/database.js";
import { User } from "../models/user.js";
import ApiError from "../utils/apiError.js";

dotenv.config();

const seedAdmin = async () => {
  try {
    await connectDB();

    const {
      ADMIN_NAME,
      ADMIN_EMAIL,
      ADMIN_PASSWORD,
      ADMIN_PHONE,
      ADMIN_AGE,
      ADMIN_GENDER,
    } = process.env;

    // Validate env variables
    if (!ADMIN_NAME || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
      throw new ApiError(
        400,
        "ADMIN_NAME, ADMIN_EMAIL and ADMIN_PASSWORD must be defined in .env"
      );
    }

    // Check if admin already exists
    const existingAdmin = await User.findOne({
      email: ADMIN_EMAIL,
    });

    if (existingAdmin) {
      throw new ApiError(409, "Admin already exists.");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);

    // Create admin
    await User.create({
      name: ADMIN_NAME,
      email: ADMIN_EMAIL,
      password: hashedPassword,
      phone: ADMIN_PHONE,
      age: Number(ADMIN_AGE),
      gender: ADMIN_GENDER,
      role: "admin",
    });

    console.log("Admin created successfully.");
    process.exit(0);

  } catch (error) {
    console.error(`${error.message}`);
    process.exit(1);
  }
};

seedAdmin();