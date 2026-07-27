import mongoose from "mongoose";

const clinicCaseFileSchema = new mongoose.Schema(
  {
    fileUrl: {
      type: String,
      required: true,
    },
    fileName: {
      type: String,
      required: true,
      trim: true,
    },
    fileType: {
      type: String,
      enum: [
        "MRI report",
        "x-ray",
        "blood test",
        "referral letter",
        "prescription",
        "discharge summary",
        "other",
      ],
      default: "other",
    },
    clinicCase: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ClinicCase",
      default: null,
      index: true,
    },
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ClinicPatient",
      default: null,
      index: true,
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const ClinicCaseFile = mongoose.model("ClinicCaseFile", clinicCaseFileSchema);

export { ClinicCaseFile };
