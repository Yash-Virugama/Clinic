import mongoose from "mongoose";

const clinicVisitSchema = new mongoose.Schema(
  {
    clinicCase: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ClinicCase",
      required: true,
      index: true,
    },
    visitDate: {
      type: Date,
      required: true,
    },
    visitTime: {
      type: String, // format: "HH:MM" (clock/watch selection)
      trim: true,
    },
    therapist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },
    location: {
      type: String,
      enum: ["clinic", "home", "online"],
      required: true,
    },
    duration: {
      type: Number, // in minutes
    },
    paymentAmount: {
      type: Number,
      required: true,
      default: 0,
    },
    paymentStatus: {
      type: String,
      enum: ["Paid", "Unpaid"],
      required: true,
      default: "Unpaid",
    },
    status: {
      type: String,
      enum: ["Scheduled", "Completed", "Cancelled"],
      default: "Scheduled",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const ClinicVisit = mongoose.model("ClinicVisit", clinicVisitSchema);

export { ClinicVisit };
