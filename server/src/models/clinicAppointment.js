import mongoose from "mongoose";

const clinicAppointmentSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ClinicPatient",
      required: true,
      index: true,
    },
    therapist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    date: {
      type: Date,
      required: true,
    },
    time: {
      type: String, // format: "HH:MM" (clock/watch selection)
      required: true,
      trim: true,
    },
    duration: {
      type: Number, // in minutes
      required: true,
    },
    location: {
      type: String,
      enum: ["clinic", "home", "online"],
      required: true,
    },
    clinicCase: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ClinicCase",
      default: null,
      index: true,
    },
    status: {
      type: String,
      enum: ["scheduled", "complete", "missed", "cancel"],
      default: "scheduled",
      required: true,
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

const ClinicAppointment = mongoose.model("ClinicAppointment", clinicAppointmentSchema);

export { ClinicAppointment };
