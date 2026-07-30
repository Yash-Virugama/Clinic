import mongoose, { Schema } from "mongoose";

const staffInvitationSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    role: {
      type: String,
      required: true,
      enum: ["admin", "assistant", "intern", "physiotherapist", "receptionist"],
    },
    permissions: {
      type: [String],
      default: [],
    },
    token: {
      type: String,
      required: true,
      unique: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    invitedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    used: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
staffInvitationSchema.index({ token: 1 });
staffInvitationSchema.index({ email: 1 });
staffInvitationSchema.index({ expiresAt: 1 });

const StaffInvitation = mongoose.model("StaffInvitation", staffInvitationSchema);

export { StaffInvitation };
