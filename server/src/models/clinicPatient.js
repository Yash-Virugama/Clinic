import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
  {
    noteType: {
      type: String,
      required: true,
      enum: ["general", "alert"],
    },
    note: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

const clinicPatientSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    gender: {
      type: String,
      required: true,
      enum: ["Male", "Female", "Other"],
    },
    phone: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    age: {
      type: Number,
      required: true,
    },
    notes: [noteSchema],
  },
  {
    timestamps: true,
  }
);

const ClinicPatient = mongoose.model("ClinicPatient", clinicPatientSchema);

export { ClinicPatient };
