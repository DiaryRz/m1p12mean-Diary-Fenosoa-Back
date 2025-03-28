const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    sender: { type: String, ref: "User" },
    recipient: {
      type: String,
      ref: "User",
      default: null,
    },
    role: {
      type: String,
      enum: ["manager", "client", "mechanics"],
      required: true,
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

// Indexes for faster queries
notificationSchema.index({ userId: 1 });
notificationSchema.index({ userRole: 1 });
notificationSchema.index({ read: 1 });
notificationSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Notification", notificationSchema);
