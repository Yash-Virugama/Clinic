import mongoose from "mongoose";

const clinicCaseSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ClinicPatient",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    consultingDoctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ["Active", "Resolved", "Closed", "Cancelled"],
      default: "Active",
      required: true,
    },
    treatment: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const ClinicCase = mongoose.model("ClinicCase", clinicCaseSchema);

export { ClinicCase };
