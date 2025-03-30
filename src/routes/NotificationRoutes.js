const express = require("express");
const router = express.Router();
const Notification = require("../models/Notifications"); // Adjust path as needed
const User = require("../models/Users"); // Adjust path as needed
const { verifyToken } = require("../services/AuthService");

// Get user's notifications
router.get("/:context", verifyToken, async (req, res) => {
  const cond =
    req.params.context == "client"
      ? { recipient: req.user._id }
      : req.params.context == "manager"
        ? { role: "manager" }
        : req.params.context == "mechanics"
          ? { role: "mechanics" }
          : { role: "employee" };

  try {
    const notifications = await Notification.find(cond)
      .sort({ createdAt: -1 })
      .limit(50)
      .populate("sender", "name email");

    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: "Error fetching notifications" });
  }
});

// Mark a single notification as read
router.patch("/:notificationId/read", verifyToken, async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      {
        _id: req.params.notificationId,
      },
      { read: true },
    );

    if (!notification) {
      return res.status(404).json({ error: "Notification not found" });
    }

    res.json(notification);
  } catch (error) {
    res.status(500).json({ error: "Error marking notification as read" });
  }
});

// Mark all notifications as read
router.patch("/read-all", verifyToken, async (req, res) => {
  try {
    await Notification.updateMany(
      {
        recipient: req.user._id,
        read: false,
      },
      { read: true },
    );

    res.json({ message: "All notifications marked as read" });
  } catch (error) {
    res.status(500).json({ error: "Error marking notifications as read" });
  }
});

// Get unread notification count
router.get("/unread-count", verifyToken, async (req, res) => {
  try {
    const count = await Notification.countDocuments({
      recipient: req.user._id,
      read: false,
    });

    res.json({ count });
  } catch (error) {
    res.status(500).json({ error: "Error counting unread notifications" });
  }
});

module.exports = router;
