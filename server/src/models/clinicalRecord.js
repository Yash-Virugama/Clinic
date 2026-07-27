import mongoose from "mongoose";

const clinicalRecordSchema = new mongoose.Schema(
  {
    chiefComplaint: {
      type: String,
      required: true,
      trim: true,
    },
    diagnosis: {
      type: String,
      trim: true,
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
    treatmentPlan: {
      type: String,
      trim: true,
    },
    alertsAndPrecautions: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const ClinicalRecord = mongoose.model("ClinicalRecord", clinicalRecordSchema);

export { ClinicalRecord };
