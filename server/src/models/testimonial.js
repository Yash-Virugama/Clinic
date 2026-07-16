import mongoose from "mongoose";

const testimonialSchema = new mongoose.Schema(
  {

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    patientName: {
      type: String,
      required: [true, "Patient name is required"],
      trim: true,
    },

    content: {
      type: String,
      required: [true, "Testimonial content is required"],
      trim: true,
    },

    treatment: {
      type: String,
      required: [true, "Treatment name is required"],
      trim: true,
    },

    rating: {
      type: Number,
      required: [true, "Star rating is required"],
      min: [1, "Rating cannot be less than 1"],
      max: [5, "Rating cannot be more than 5"],
      default: 5,
    },

    approved: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Testimonial = mongoose.model("Testimonial", testimonialSchema);

export { Testimonial };