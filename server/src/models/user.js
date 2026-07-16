import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
    {
        name: {
            type: String,
            required: true
        },

        email: {
            type: String,
            required: true,
            unique: true
        },

        password: {
            type: String,
            required: true,
        },

        phone: {
            type: String,
            required: true,
        },

        age: {
            type: Number,
            required: true,
        },

        gender: {
            type: String,
            enum: ["Male", "Female", "Other", "Prefer not to say"],
        },

        role: {
            type: String,
            enum: ["patient", "admin"],
            default: "patient"
        },

        image: {
            type: String,
            default: ""
        },

        passwordResetToken: {
            type: String,
        },

        passwordResetExpires: {
            type: Date,
        },
    },

    {
        timestamps: true,
    }

);

const User = mongoose.model("User", userSchema);

export { User };